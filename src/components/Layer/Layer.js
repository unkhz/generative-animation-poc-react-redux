import './Layer.scss';
import React, { Component } from 'react';
import * as shapes from 'constants/Shapes';
import Particle from 'components/Particle/Particle';

class Layer extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.sn !== this.props.sn;
  }

  renderColorValue(color) {
    return `rgb(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)})`;
  }

  renderParticleContent() {
    const { color } = this.props;
    return (
      <svg width="300" height="300" viewBox="0 0 51 48" color-rendering="optimizeSpeed" shape-rendering="optimizeSpeed">
        <path fill={this.renderColorValue(color)} stroke="none" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
      </svg>
    );
  }

  renderParticles() {
    const { particles, actions } = this.props;
    return particles.map((particle) => {
      return (
        <Particle
          key={ particle.id }
          { ...particle }
          actions={actions}
        >{this.renderParticleContent()}</Particle>
      );
    });
  }

  render() {
    return (
      <div
        className="layer"
      >{this.renderParticles()}</div>
    );
  }
};

Layer.propTypes = {
  actions: shapes.actions,
  particles: shapes.particles,
};

export default Layer;
