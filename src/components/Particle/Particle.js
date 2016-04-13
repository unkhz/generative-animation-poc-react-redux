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

  getStyleValue(value: number|string, unit: string): number|string {
    return unit ? '' + value + unit : value;
  }

  mapStyle(obj: Object, unit: Object = {}): Object {
    return Object.keys(obj).reduce((all: Object, styleProp: string): Object => {
      all[styleProp] = this.getStyleValue(obj[styleProp], unit[styleProp] || '');
      return all;
    }, {});
  }

  mapPropsToStyle(props: ParticleType): React.Element {
    const transform = Object.keys(props.transform).reduce((transform: string[], func: string): string[] => {
      const value = props.transform[func];
      transform.push(func + '(' + this.getStyleValue(value, props.unit[func]) + ')');
      return transform;
    }, []).join(' ');
    return {
      ...this.mapStyle(props.style, props.unit),
      transform
    };
  }
}

export default Particle;
