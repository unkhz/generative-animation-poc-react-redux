import 'styles/main';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as Actions from '../Actions/Actions';
import Layer from '../components/Layer/Layer';
import { connect } from 'react-redux';

class App extends Component {

  render() {
    return (
      <div className="page">
        <span>{this.props.layer.particles.length}</span>
        <Layer { ...this.props.layer } actions={ this.props.actions } />
      </div>
    );
  }
}

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
)(App);
