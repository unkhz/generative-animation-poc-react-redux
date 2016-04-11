// @flow
import './Particle.scss';
import React, { Component } from 'react';
import type {ParticleType} from 'constants/Types';


class Particle extends Component {

  shouldComponentUpdate(nextProps: ParticleType): boolean {
    return nextProps.sn !== this.props.sn;
  }

  render(): React.Element {
    return (
      <div
        className="particle"
        style={this.mapPropsToStyle(this.props)}
      >{this.props.children}</div>
    );
  }

  mapPropsToStyle(props: ParticleType): React.Element {
    const transform = Object.keys(props.transform).reduce((transform: string[], func: string): string[] => {
      const value = props.transform[func];
      transform.push(func + '(' + value + props.unit[func] + ')');
      return transform;
    }, []).join(' ');
    return {
      ...props.style,
      transform
    };
  }
}

export default Particle;
