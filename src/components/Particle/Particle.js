import './Particle.scss';
import React, { Component } from 'react';

class Particle extends Component {

  render() {
    return (
      <div
        className="particle"
        style={this.mapPropsToStyle(this.props)}
        onClick={this.handleClick.bind(this)}
      >{this.props.children}</div>
    );
  }

  mapPropsToStyle(props) {
    const transform = Object.keys(props.transform).reduce((transform, func) => {
      const value = props.transform[func];
      transform.push(func + '(' + value + props.unit[func] + ')');
      return transform;
    }, []).join(' ');
    return Object.assign({}, props.style, {
      transform
    });
  }

  handleClick(evt) {
    this.props.actions.deleteParticle(this.props.id);
    evt.stopPropagation();
  }
}

export default Particle;
