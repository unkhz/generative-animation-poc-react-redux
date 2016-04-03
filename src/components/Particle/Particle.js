import './Particle.scss';
import React, {Component} from 'react';

class Particle extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      style: this.mapStyles(props)
    };
  }

  componentWillMount() {
    this.requestMove(this.props);
  }

  requestMove(props) {
    props.actions.requestParticleMove(props.id, props.frameRequestId);
  }

  componentWillReceiveProps() {
    this.setState({
      style: this.mapStyles(this.props)
    });
  }

  mapStyles(props) {
    const transform = Object.keys(props.transform).reduce((transform, func) => {
      const value = props.transform[func];
      transform.push(func + '(' + value + props.unit[func] + ')');
      return transform;
    }, []).join(' ');
    return Object.assign({}, props.style, {
      transform
    });
  }

  render() {
    const { style } = this.state;
    return <div className="particle" style={style} onClick={this.handleClick.bind(this)}>{this.props.children}</div>;
  }

  handleClick(evt) {
    this.props.actions.deleteParticle(this.props.id);
    evt.stopPropagation();
  }
}

export default Particle;
