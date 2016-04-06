import 'styles/main';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as Actions from '../Actions/Actions';
import Layer from '../components/Layer/Layer';
import { connect } from 'react-redux';

class App extends Component {

  componentWillMount() {
    this.props.actions.appMounted();
  }

  renderLayers() {
    const { layers } = this.props;
    return layers.map((layer) => {
      return (
        <Layer
          key={layer.id}
          { ...layer }
          particles={ this.props.particles.filter((p) => p.id%layers.length === layer.id) }
          actions={ this.props.actions }
        />
      );
    });
  }

  render() {
    let isColorEnabled = this.props.layers[0].isColorEnabled;
    return (
      <div className="page" onWheel={this.onWheel.bind(this)}>
        <span>{this.props.particles.filter((p) => !p.isToBeDestroyed).length}</span>
        {this.renderLayers()}
      </div>
    );
  }

  onWheel(evt) {
    this.props.actions.appScrollWheeled(evt.deltaX, evt.deltaY);
    evt.stopPropagation();
    evt.preventDefault();
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
