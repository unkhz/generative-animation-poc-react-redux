import React, {PropTypes, Component} from 'react';

class Touchable extends Component {

  static get propTypes() {
    return {
      onTouchStart: PropTypes.func,
      onTouchMove: PropTypes.func,
      onTouchDrag: PropTypes.func,
      onTouchEnd: PropTypes.func,
      onTouchCancel: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {
      onTouchStart: () => undefined,
      onTouchMove: () => undefined,
      onTouchDrag: () => undefined,
      onTouchEnd: () => undefined,
      onTouchCancel: () => undefined,
    };
  }

  static get defaultState() {
    return {
      touches: [],
      delta: []
    };
  }

  shouldComoponentUpdate() {
    return false;
  }

  render() {
    return (
      <div
        {...this.props}
        onTouchStart={this.onTouchStart.bind(this)}
        onTouchMove={this.onTouchMove.bind(this)}
        onTouchEnd={this.onTouchEnd.bind(this)}
        onTouchCancel={this.onTouchCancel.bind(this)}
      >
        {this.props.children}
      </div>
    );
  }

  onTouchStart(evt) {
    this.initStateFromEvent(evt);
    this.props.onTouchStart(evt);
  }

  onTouchMove(evt) {
    this.props.onTouchMove(evt);
    const delta = this.getDelta(evt);
    if (this.props.onTouchDrag) {
      this.props.onTouchDrag(evt, delta);
    }
    this.setState({
      delta
    });
  }

  onTouchEnd(evt) {
    this.props.onTouchEnd(evt);
    this.initStateFromEvent(evt);
  }

  onTouchCancel(evt) {
    this.props.onTouchCancel(evt);
    this.initStateFromEvent(evt);
  }

  getDelta(evt) {
    const evtTouches = Array.prototype.slice.call(evt.touches);
    const stateTouches = this.state.touches;
    const stateDelta = this.state.delta;
    const clientX = evtTouches.map((touch, id) => touch.clientX - stateTouches[id].clientX);
    const clientY = evtTouches.map((touch, id) => touch.clientY - stateTouches[id].clientY);
    const delta = evtTouches.map((touch, id) => this.createDelta(
      clientX[id],
      clientY[id],
      clientX[id] - stateDelta[id].clientX,
      clientY[id] - stateDelta[id].clientY,
    ));
    return delta;
  }

  initStateFromEvent(evt) {
    const touches = Array.prototype.slice.call(evt.touches);
    this.setState({
      touches,
      delta: touches.map((touch) => this.createDelta(touch.clientX, touch.clientY, 0, 0)),
    });
  }

  createDelta(clientX, clientY, deltaX, deltaY) {
    return {clientX, clientY, deltaX, deltaY};
  }

};

export default Touchable;
