# Generative animation POC with React/Redux

  * React used for view layer / virtual DOM
  * Redux used for handling updates to individual particle states
  * Idea of generative animation based on [Distract.js](https://github.com/unkhz/Distract.js)
  * [rr-boilerplate](https://github.com/a-tarasyuk/rr-boilerplate.git) used for build and scaffolding

### Dependencies

  * [React](https://facebook.github.io/react)
  * [Redux](https://github.com/rackt/redux)
  * [Webpack](https://webpack.github.io)
  * [Babel](https://babeljs.io)

### NPM tasks

- `npm run dev-server` - starts local development web server in port 9999
- `npm start`- starts production build and run local web server in port 9999
- `npm run build` - starts production build *(puts result to `build` folder)*

### Conclusions

First of all, using virtual DOM for generative animation is clearly an idiotic idea.
When each frame is intentionally incremented so that DOM update is always required,
the whole benefit of having a virtual DOM is lost and turned into overhead instead.
So, the intention was not to prove anything, but just to see what happens.

The React/Redux POC gets sluggish with 32 particles, while [a pure JavaScript version](https://embed.plnkr.co/773Cms/)
animates 128 particles effortlessly. This leads to think that when DOM updates
are constant, breaking out of the virtual DOM might be a good idea.
