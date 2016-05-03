[![Build Status](https://travis-ci.org/unkhz/generative-animation-poc-react-redux.svg?branch=master)](https://travis-ci.org/unkhz/generative-animation-poc-react-redux)
[![Code Climate](https://codeclimate.com/github/unkhz/generative-animation-poc-react-redux/badges/gpa.svg)](https://codeclimate.com/github/unkhz/generative-animation-poc-react-redux)
[![Test Coverage](https://codeclimate.com/github/unkhz/generative-animation-poc-react-redux/badges/coverage.svg)](https://codeclimate.com/github/unkhz/generative-animation-poc-react-redux/coverage)

# Generative animation POC with React/Redux

  * React used for view layer / virtual DOM
  * Redux used for state management
  * Idea of generative animation based on [Distract.js](https://github.com/unkhz/Distract.js)
  * [rr-boilerplate](https://github.com/a-tarasyuk/rr-boilerplate.git) used as the seed boilerplate

### Live demo

http://un.khz.fi/generative-animation-poc-react-redux/

### Key ingredients

  * [React](https://facebook.github.io/react)
  * [Redux](https://github.com/rackt/redux)
  * [Webpack](https://webpack.github.io)
  * [Babel](https://babeljs.io)
  * [Flow](http://flowtype.org/)
  * [Karma](https://karma-runner.github.io/)
  * [Mocha](https://mochajs.org/)

### NPM tasks

- `npm run dev-server` starts local development web server in port 9999
- `npm start` starts production build and run local web server in port 9999
- `npm run build` starts production build
- `npm test` runs tests once
- `npm run test-watch` runs tests and watches for changes

### Findings

#### Performance

First of all, using virtual DOM for generative animation is technically an
idiotic idea. When each frame is intentionally incremented so that DOM update is
always required, the whole benefit of having a virtual DOM is lost and turned
into overhead instead. So, the intention was not to prove anything, but just to
see what happens.

After first iteration the React/Redux POC seems sluggish with 32 particles,
while [a pure JavaScript version](https://embed.plnkr.co/773Cms/) of the same
concept animates 128 particles effortlessly. This leads to think that when DOM
updates are constant, breaking out of the virtual DOM might be a good idea.

Quick analysis shows that switching from requesting a separate animation frame
for each particle to updating all particles within one frame, gives a
significant boost to performance. 128 particles is effortless. With 1024
particles the difference is still noticeable to [pure Javascript
version](https://embed.plnkr.co/cR14fu/) albeit not as drastic as with one frame
per particle update.

After moving from performance analysis to trying out more things related to
state management, the performance kept degrading. This is expected, as new logic
gets added. I still wanted to try if I could improve it by using a WebGL canvas
instead of DOM elements with and SVG shapes. The result can be tried out in [a
WebGL spinoff
project](https://github.com/unkhz/generative-animation-poc-react-redux-threejs).

In this case the performance is actually slightly worse than with DOM, which is
not too surprising as the animation is done only using CSS 3D transforms and
opacity, which are already heavily optimized in Chrome. Using CSS properties
that do not need a reflow of the surrounding page or even their own descendants
is extremely fast, as the DOM elements get rendered to images which are then
manipulated at the GPU level same way as WebGL calls are. The real benefit of
WebGL and canvas is found by taking full control of the lower level optimization
possibilities rather than just repeating the exact same thing that's don with DOM
already. E.g. re-rendering only a tiny part of an image when the surrounding
area is static.

#### State design

##### Reducer reducer

My first instinct was to try moving the decision of the state structure from
the root reducer to the partial reducers. Initially I replaced combineReducers
with a custom  monad reducer component, but it was unnecessarily complex for
something that is anyway happening synchronously. I converted to simply reducing
an Array of reducers to pipe output from one partial reducer to the other,
giving the reducers full control over which pieces of state the want to A)
modify or B) use as an input or intermediate state. This should allow less
duplication in the state tree and make it easier to keep the structure flat.

The drawback is slightly more complicated reducers as there needs to be logic
for deciding if the state has been initialized for a particular reducer or not.
Also, the dependencies caused by shared parts of the state are not clearly
visible in this approach. Fixing that needs some more thought.

The more state dependencies I kept adding, the more clear it became that the
free piping of reducers leads to a wild west of coupled state, for which no
guidance is given by the framework. Also, there's a lot of unnecessary
boilerplate needed when every reducer has to make sure that the global state is
intact. Even with ES7 object rest/spread extension it is tedious and
error-prone. The most significant impact is on the testability of the reducers,
as all the coupled state needs to be mocked or otherwise initialized in tests.

##### Reducer graph

I decided to use a more explicit approach inspired by [topologically-combine-reducers](https://github.com/KodersLab/topologically-combine-reducers).
Individual reducers can still have dependencies on pieces of state exported by
other reducers, but the dependencies become explicit by the following rules being
enforced:

  * A reducer must define exactly one export, which is used as the prop key in the root reducer
  * A reducer may define zero or more imports, which will be given to them as a parameter
  * Reducers are organized into a graph and sorted topologically
  * Circular dependencies cause a failure

The rules imply that the coupling of the state is one-directional, which makes
the approach more easily understood and most importantly testable. With this
design I still did not lose the original benefit of the reducers having the full
control over which pieces of state they output and which they use an an input.

##### Reducer collection

Fourth pattern I've used is reducer written as a collection of rules. It's a way
of organizing business logic of a document into orthogonal statements, which
allows extension without needing to modify the root reducer of the document.

Each animating particle on the screen is essentially just a DOM element with
constantly evolving style properties. This happens via a set of rules that each
mutate only the value of a single property, by taking the current root state of
the particle document as an input. Opacity is possibly the simplest example of a
chain of rules that affect the document.

  * 1st rule constantly modifies accelerationOfOpacity with a tiny random increment
  * 2nd rule constantly increments velocityOfOpacity with the value of accelerationOfOpacity
  * 3rd rule forces velocityOfOpacity to be negative in case the particle is marked for deletion
  * 4th rule increments the actual opacity with the value of velocityOfOpacity
  * the particle component takes opacity as a prop and applies it to the style prop of a div element

This works extremely well for the generative animation use case I have, where
individual style properties are quite isolated but do depend heavily on higher
order variables like velocity or velocity of velocity (acceleration). It seems
that the principle of multiple read-only dependencies and a single export is
keeping the individual reducers clean. Similar findings as with the reducer
graph on root level.

However, the single export rule is not enforced in context of the whole document
as there might be multiple rules exporting the same property. Enforcing single
export on document level appears too restricting e.g. when observing the 2nd and
3rd rule of the opacity example. Extracting the logic of particle deletion into
a separate entity is enabled here by that freedom. The possibility of breaking
other rules is left open. There is also a time dependency between the rules.
It's a tradeoff, which makes the design of the document state important.
