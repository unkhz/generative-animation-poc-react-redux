// @flow
import 'styles/main.scss';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as Actions from 'actions/Actions';
import type {ActionMapType, LayerType, ParticleCollectionType, ParticleType} from 'constants/Types';
import Layer from 'components/Layer/Layer';
import { connect } from 'react-redux';
import './App.scss';

type AppPropsType = {
  actions: ActionMapType,
  layers: LayerType[],
  particles: ParticleCollectionType,
}

class App extends Component {

  componentWillMount() {
    this.props.actions.appMounted();
  }

  renderLayers(): React.Element {
    const { layers, particles: { particles } } = this.props;
    return layers.map((layer: LayerType): React.Element => {
      return (
        <Layer
          key={layer.id}
          { ...layer }
          particles={ particles.filter((p: ParticleType) => p.id%layers.length === layer.id) }
          actions={ this.props.actions }
        />
      );
    });
  }

  renderHelp(): React.Element {
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

  render(): React.Element {
    const { layers } = this.props;
    return (
      <div className="full-screen-container app">
        {this.renderHelp()}
        {this.renderLayers()}
      </div>
    );
  }
}

function mapStateToProps(state: Object): Object {
  return state;
}

function mapDispatchToProps(dispatch: Function): Object {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
