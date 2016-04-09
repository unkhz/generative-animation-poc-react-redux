import 'styles/main';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as Actions from 'actions/Actions';
import * as shapes from 'constants/Shapes';
import Layer from 'components/Layer/Layer';
import { connect } from 'react-redux';
import './App.scss';

class App extends Component {

  componentWillMount() {
    this.props.actions.appMounted();
  }

  renderLayers() {
    const { layers, particles: { particles } } = this.props;
    return layers.map((layer) => {
      return (
        <Layer
          key={layer.id}
          { ...layer }
          particles={ particles.filter((p) => p.id%layers.length === layer.id) }
          actions={ this.props.actions }
        />
      );
    });
  }

  renderHelp() {
    const { layers, particles: { count, particles } } = this.props;
    if (count === 0) {
      return (
        <div className="help" data-count={count}><div>
          scroll to add particles<br/>
          space to pause
        </div></div>
      );
    } else {
      return <div className="layer help" data-count={count}><div>{count}</div></div>;
    }
  }

  render() {
    const { layers } = this.props;
    return (
      <div className="page" onWheel={this.onWheel.bind(this)}>
        {this.renderHelp()}
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

App.propTypes = {
  actions: shapes.actions,
  layers: shapes.layers,
  particles: shapes.particleCollection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
