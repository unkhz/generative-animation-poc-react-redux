# Generative animation POC with React/Redux

  * React used for view layer / virtual DOM
  * Redux used for state management
  * Idea of generative animation based on [Distract.js](https://github.com/unkhz/Distract.js)
  * [rr-boilerplate](https://github.com/a-tarasyuk/rr-boilerplate.git) used for build and scaffolding

### Live demo

http://un.khz.fi/generative-animation-poc-react-redux/

### Dependencies

  * [React](https://facebook.github.io/react)
  * [Redux](https://github.com/rackt/redux)
  * [Webpack](https://webpack.github.io)
  * [Babel](https://babeljs.io)

### NPM tasks

- `npm run dev-server` - starts local development web server in port 9999
- `npm start`- starts production build and run local web server in port 9999
- `npm run build` - starts production build *(puts result to `build` folder)*

### Findings

First of all, using virtual DOM for generative animation is technically an idiotic idea.
When each frame is intentionally incremented so that DOM update is always required,
the whole benefit of having a virtual DOM is lost and turned into overhead instead.
So, the intention was not to prove anything, but just to see what happens.

After first iteration the React/Redux POC seems sluggish with 32 particles, while
[a pure JavaScript version](https://embed.plnkr.co/773Cms/) of the same concept
animates 128 particles effortlessly. This leads to think that when DOM updates
are constant, breaking out of the virtual DOM might be a good idea.

Quick analysis shows that switching from requesting a separate animation frame for each
particle to updating all particles within one frame, gives a significant boost to performance. 128
particles is effortless. With 1024 particles the difference is still noticeable to [pure
Javascript version](https://embed.plnkr.co/cR14fu/) albeit not as drastic as with one frame
per particle update.
