// @flow
import 'styles/main.scss';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as actions from 'actions/Actions';
import {styleDefinitions, decideStyle} from 'reducers/styles/definitions';
import type {ActionMapType, LayerType, GlobalStateType, ParticleType, StyleDefinitionType, StyleType} from 'constants/Types';
import Help from 'components/Help';
import Layer from 'components/Layer';
import { connect } from 'react-redux';
import {find} from 'lodash';
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
      requestParticleMove: (): undefined => undefined,
      addStyle: (): undefined => undefined,
    },
    layers: [],
    aliveParticleCount: 0,
    particles: []
  };

  componentWillMount() {
    this.props.actions.requestParticleMove();
    styleDefinitions.map((styleDefinition: StyleDefinitionType) => {
      this.props.actions.addStyle(styleDefinition);
    });
    setInterval(this.recycleParticles.bind(this), 200);
  }

  recycleParticles() {
    if (this.props.particles.length > 10) {
      const styleName = decideStyle((s: StyleDefinitionType): boolean => s.allowRecycling);
      const particleToDelete = find(this.props.particles, (p: ParticleType): boolean => (
        !p.isToBeDestroyed && p.styleName === styleName
      ));
      if (particleToDelete) {
        this.props.actions.deleteParticle(particleToDelete.id);
        this.props.actions.addParticle(1, styleName);
      }
    }
  }

  renderLayers(): React.Element {
    const {layers, particles} = this.props;
    return layers.map((layer: LayerType): React.Element => {
      return (
        <Layer
          key={layer.id}
          { ...layer }
          particles={ particles.filter((particle: ParticleType): boolean => particle.styleName === layer.styleName) }
        />
      );
    });
  }

  render(): React.Element {
    const { aliveParticleCount, layers } = this.props;
    return (
      <div className="full-screen-container app">
        <Help aliveParticleCount={aliveParticleCount} />
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
