import React, { Component, Children } from 'react';
import { bindActionCreators } from 'redux';
import * as Actions from 'actions/Actions';
import * as shapes from 'constants/Shapes';
import { connect } from 'react-redux';

class Environment extends Component {

  componentWillMount() {
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

  listenToEvent(target, event, callback) {
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
    this.state.eventListeners.forEach((handle) => {
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

  onKeyPress(evt) {
    // space toggles animation
    if (evt.keyCode === 32) {
      this.props.actions.toggleAnimation();
    }
  }

  onWheel(evt) {
    // wheel controls amount of particles
    if (evt.deltaY > 0) {
      this.props.actions.addParticle(1);
    } else {
      this.props.actions.deleteSomeParticles(1);
    }
    evt.stopPropagation();
    evt.preventDefault();
  }

  render() {
    const { children } = this.props;
    return Children.only(children);
  }
}

Environment.propTypes = {
  actions: shapes.actions
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Environment);
