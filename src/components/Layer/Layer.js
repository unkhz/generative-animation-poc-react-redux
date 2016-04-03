import './Layer.scss';
import React, { Component } from 'react';
import Particle from 'components/Particle/Particle';

class Layer extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      particles: props.particles
    };
  }

  componentWillReceiveProps() {
    this.setState({
      particles: this.props.particles
    });
  }

  add() {
    this.props.actions.addParticle();
  }

  renderParticles() {
    const { particles } = this.state;
    const { actions } = this.props;
    return particles.map((particle) => {
      return <Particle key={ particle.id } { ...particle } actions={actions}>
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 51 48"><path fill="#800" stroke="none" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/></svg>
      </Particle>;
    });
  }

  render() {
    return <div className="layer" onClick={this.add.bind(this)}>{this.renderParticles()}</div>;
  }
};

export default Layer;
