// @flow
import './Layer.scss';
import React, { Component } from 'react';
import type {ActionMapType, LayerType, ParticleType, ColorType} from 'constants/Types';
import Particle from 'components/Particle';

type LayerPropsType = {
  particles: ParticleType[],
}

class Layer extends Component {

  static defaultProps = {
    particles: [],
  };

  shouldComponentUpdate(nextProps: Object): boolean {
    return nextProps.sn !== this.props.sn;
  }

  renderParticles(props: LayerType): React.Element[] {
    const {particles} = props;
    return particles.map((particle: ParticleType): React.Element => {
      return (
        <Particle
          key={ particle.id }
          { ...particle }
        />
      );
    });
  }

  render(): React.Element {
    return (
      <div
        className="layer"
      >{this.renderParticles(this.props)}</div>
    );
  }
};

export default Layer;
