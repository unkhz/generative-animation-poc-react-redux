// @flow
import './Layer.scss';
import React, { Component } from 'react';
import type {ActionMapType, ParticleType, ColorType} from 'constants/Types';
import Particle from 'components/Particle';

type LayerPropsType = {
  particles: ParticleType[],
}

class Layer extends Component {

  static defaultProps = {
    particles: [],
    color: {
      r: 0,
      g: 0,
      b: 0,
    },
  };

  shouldComponentUpdate(nextProps: Object): boolean {
    return nextProps.sn !== this.props.sn;
  }

  renderColorValue(color: ColorType): string {
    return `rgb(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)})`;
  }

  renderParticleContent(): React.Element {
    const { color } = this.props;
    return (
      <svg width="300" height="300" viewBox="0 0 51 48" color-rendering="optimizeSpeed" shape-rendering="optimizeSpeed">
        <path fill={this.renderColorValue(color)} stroke="none" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
      </svg>
    );
  }

  renderParticles(): React.Element[] {
    const {particles} = this.props;
    return particles.map((particle: ParticleType): React.Element => {
      return (
        <Particle
          key={ particle.id }
          { ...particle }
        >{this.renderParticleContent()}</Particle>
      );
    });
  }

  render(): React.Element {
    return (
      <div
        className="layer"
      >{this.renderParticles()}</div>
    );
  }
};

export default Layer;
