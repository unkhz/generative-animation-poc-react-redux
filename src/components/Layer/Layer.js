import './Layer.scss';
import React, { Component } from 'react';
import Particle from 'components/Particle/Particle';

class Layer extends Component {

  componentWillMount() {
    this.requestMove();
  }

  requestMove() {
    this.props.actions.requestParticleMove(this.props.frameRequestId);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.sn !== this.props.sn;
  }

  componentDidUpdate() {
    this.requestMove();
  }

  renderParticleContent() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 51 48">
        <path fill="#800" stroke="none" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
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
        onClick={this.props.actions.addParticle}
      >{this.renderParticles()}</div>
    );
  }
};

export default Layer;
