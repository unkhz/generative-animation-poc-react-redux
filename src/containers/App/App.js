// @flow
import 'styles/main.scss';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as actions from 'actions/Actions';
import * as styles from 'constants/Rules';
import type {ActionMapType, LayerType, GlobalStateType, ParticleType} from 'constants/Types';
import Layer from 'components/Layer';
import { connect } from 'react-redux';
import './App.scss';

type AppPropsType = {
  actions: ActionMapType,
  layers: LayerType[],
  particles: ParticleType[],
  aliveParticleCount: number,
}

export class App extends Component {

  static defaultProps = {
    actions: {
      requestParticleMove: () => undefined,
      addStyle: () => undefined,
    },
    layers: [],
    aliveParticleCount: 0,
    particles: []
  };

  componentWillMount() {
    this.props.actions.requestParticleMove();
    this.props.actions.addStyle(styles.frontRotaterStyleFactory());
    this.props.actions.addStyle(styles.backBlinkerStyleFactory());
  }

  renderLayers(): React.Element {
    const {layers, particles} = this.props;
    return layers.map((layer: LayerType): React.Element => {
      return (
        <Layer
          key={layer.id}
          { ...layer }
          particles={ particles.filter((p: ParticleType) => p.id%layers.length === layer.id) }
        />
      );
    });
  }

  renderHelp(): React.Element {
    const {layers, aliveParticleCount, particles} = this.props;
    if (aliveParticleCount === 0) {
      return (
        <div className="help" data-count={aliveParticleCount}><div>
          scroll to add particles<br/>
          space to pause
        </div></div>
      );
    } else {
      return <div className="layer help" data-count={aliveParticleCount}><div>{aliveParticleCount}</div></div>;
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

function mapStateToProps(state: GlobalStateType): GlobalStateType {
  const {layers, particles, aliveParticleCount} = state;
  return {
    layers,
    particles,
    aliveParticleCount
  };
}

function mapDispatchToProps(dispatch: Function): Object {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
