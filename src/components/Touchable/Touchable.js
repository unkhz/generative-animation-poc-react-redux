import React, {Component} from 'react';

type TouchablePropsType = {
  onTouchStart: () => void,
  onTouchMove: () => void,
  onTouchDrag: () => void,
  onTouchEnd: () => void,
  onTouchCancel: () => void,
};

type TouchableStateType = {
  touches: TouchList,
  delta: TouchableDeltaType[],
}

export type TouchableDeltaType = {
  clientX: number,
  clientY: number,
  deltaX: number,
  deltaY: number,
};

class Touchable extends Component {

  static defaultProps: TouchablePropsType = {
    onTouchStart: (): undefined => undefined,
    onTouchMove: (): undefined => undefined,
    onTouchDrag: (): undefined => undefined,
    onTouchEnd: (): undefined => undefined,
    onTouchCancel: (): undefined => undefined,
  };

  static defaultState: TouchableStateType = {
    touches: [],
    delta: [],
  };

  shouldComoponentUpdate(): boolean {
    return false;
  }

  render(): React.Element {
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

  onTouchStart(evt: Event) {
    this.initStateFromEvent(evt);
    this.props.onTouchStart(evt);
  }

  onTouchMove(evt: Event) {
    this.props.onTouchMove(evt);
    const delta = this.getDelta(evt);
    this.props.onTouchDrag(evt, delta);
    this.setState({
      delta
    });
  }

  onTouchEnd(evt: Event) {
    this.props.onTouchEnd(evt);
    this.initStateFromEvent(evt);
  }

  onTouchCancel(evt: Event) {
    this.props.onTouchCancel(evt);
    this.initStateFromEvent(evt);
  }

  getDelta(evt: Event): TouchableDeltaType {
    const evtTouches = [...evt.touches];
    const stateTouches = this.state.touches;
    const stateDelta = this.state.delta;
    const clientX = evtTouches.map((touch: Touch, id: number): number => touch.clientX - stateTouches[id].clientX);
    const clientY = evtTouches.map((touch: Touch, id: number): number => touch.clientY - stateTouches[id].clientY);
    const delta = evtTouches.map((touch: Touch, id: number): TouchableDeltaType => this.createDelta(
      clientX[id],
      clientY[id],
      clientX[id] - stateDelta[id].clientX,
      clientY[id] - stateDelta[id].clientY,
    ));
    return delta;
  }

  initStateFromEvent(evt: Event) {
    const touches = Array.prototype.slice.call(evt.touches);
    this.setState({
      touches,
      delta: touches.map((touch: Touch, id: number): TouchableDeltaType => this.createDelta(touch.clientX, touch.clientY, 0, 0)),
    });
  }

  createDelta(clientX: number, clientY: number, deltaX: number, deltaY: number): TouchableDeltaType {
    return {clientX, clientY, deltaX, deltaY};
  }

};

export default Touchable;
