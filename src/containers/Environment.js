import React, { Component, Children } from 'react';
import { bindActionCreators } from 'redux';
import * as Actions from 'actions/Actions';
import { connect } from 'react-redux';
import Touchable from 'components/Touchable/Touchable';
import type {TouchableDeltaType} from 'components/Touchable/Touchable';
import type {ActionMapType} from 'constants/Types';

type EventHandleType = {
  target: Object,
  event: string,
  callback: func
};

type EnvironmentPropsType = {
  actions: ActionMapType
};

class Environment extends Component {

  componentWillMount(nextProps: EnvironmentPropsType) {
    this.state = {
      eventListeners: []
    };

    this.listenToEvent(window, 'resize', this.onWindowResize.bind(this));
    this.onWindowResize();

    this.listenToEvent(document.body, 'keyup', this.onKeyPress.bind(this));
    this.listenToEvent(document.body, 'wheel', this.onWheel.bind(this));
  }

  componentWillUnmount() {
    this.removeAllEventListeners();
  }

  listenToEvent(target: Object, event: string, callback: func) {
    target.addEventListener(event, callback);
    this.setState({
      eventListeners: this.state.eventListeners.push({
        target,
        event,
        callback
      })
    });
  }

  removeAllEventListeners() {
    this.state.eventListeners.forEach((handle: EventHandleType) => {
      handle.target.removeEventlistener(handle.event, handle.callback);
    });
    this.setState({
      eventListeners: []
    });
  }

  onWindowResize() {
    // resize controls the environment size for particles
    this.props.actions.envResized(window.innerWidth, window.innerHeight);
  }

  onKeyPress(evt: Event) {
    // space toggles animation
    if (evt.keyCode === 32) {
      this.props.actions.toggleAnimation();
    }
  }

  onWheel(evt: Event) {
    this.addOrRemoveParticles(evt.deltaY);
    evt.stopPropagation();
    evt.preventDefault();
  }

  onTouchDrag(evt: Event, delta: TouchableDeltaType) {
    if (delta.length === 1) {
      this.addOrRemoveParticles(delta[0].deltaY);
    }
  }

  addOrRemoveParticles(delta: TouchableDeltaType) {
    if (delta > 0) {
      this.props.actions.addParticle(1);
    } else if (delta < 0) {
      this.props.actions.deleteSomeParticles(1);
    }
  }

  render(): Node {
    return (
      <Touchable
        className="full-screen-container"
        onTouchDrag={this.onTouchDrag.bind(this)}
        onTouchMove={(evt: Event) => evt.preventDefault()}
      >
        {this.props.children}
      </Touchable>
    );
  }
}

function mapStateToProps(state: Object): Object {
  return state;
}

function mapDispatchToProps(dispatch: func): Object {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Environment);
