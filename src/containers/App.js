import 'styles/main';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as Actions from '../Actions/Actions';
import LayerContainer from './LayerContainer';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    const props = this.props;
    return (
      <div className="page">
        <LayerContainer {...props} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    Layer: state.Layer
  };
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
