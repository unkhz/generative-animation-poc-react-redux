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

### Dependencies

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

#### Design

I wanted to try out moving the decision of the state structure from the root
reducer to the partial reducers. Initially I replaced combineReducers with a
custom  monad reducer component, but it was unnecessarily complex for something
that is anyway happening synchronously. I converted to simply using
lodash/fp/flow to pipe output from one partial reducer to the other, giving the
reducers full control over which pieces of state the want to A) modify or B) use
as an input or intermediate state. This should allow less duplication in the
state tree and make it easier to keep the structure flat.

The drawback is slightly more complicated reducers as there needs to be logic
for deciding if the state has been initialized for a particular reducer or not.
Also, the dependencies caused by shared parts of the state are not clearly
visible in this approach. Fixing that needs some more thought.
