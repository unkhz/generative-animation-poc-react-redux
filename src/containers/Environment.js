import React, { Component, Children } from 'react';
import { bindActionCreators } from 'redux';
import * as Actions from 'actions/Actions';
import * as shapes from 'constants/Shapes';
import { connect } from 'react-redux';

class Environment extends Component {

  componentWillMount() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    document.body.addEventListener('keyup', this.onKeyPress.bind(this));
    this.onWindowResize();
  }

  onWindowResize() {
    this.props.actions.envResized(window.innerWidth, window.innerHeight);
  }

  onKeyPress(evt) {
    if (evt.keyCode === 32) {
      // space toggles animation
      this.props.actions.toggleAnimation();
    }
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
