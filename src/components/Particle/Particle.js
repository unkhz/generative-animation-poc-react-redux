// @flow
import './Particle.scss';
import React, { Component } from 'react';
import type {ParticleType, StyleValueType} from 'constants/Types';


class Particle extends Component {

  static defaultProps = {
    transform: {},
    style: {},
  };

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

  getStyleValue(value: StyleValueType): number|string {
    return Array.isArray(value) ? value.join('') : value;
  }

  mapStyle(obj: Object): Object {
    return Object.keys(obj).reduce((all: Object, styleProp: string): Object => {
      all[styleProp] = this.getStyleValue(obj[styleProp]);
      return all;
    }, {});
  }

  mapPropsToStyle(props: ParticleType): React.Element {
    const transform = Object.keys(props.transform).reduce((transform: string[], func: string): string[] => {
      const value = props.transform[func];
      transform.push(func + '(' + this.getStyleValue(value) + ')');
      return transform;
    }, []).join(' ');
    const style = this.mapStyle(props.style);
    return {
      ...style,
      transform
    };
  }
}

export default Particle;
