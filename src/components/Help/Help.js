// @flow
import React, { Component } from 'react';
import './Help.scss';

export default class Help extends Component {

  render(): React.Element {
    const {aliveParticleCount} = this.props;
    if (aliveParticleCount === 0) {
      return (
        <div className="help" data-count={aliveParticleCount}><div>
          scroll to add particles<br/>
          space to pause
        </div></div>
      );
    } else {
      return <div className="help" data-count={aliveParticleCount}><div>{aliveParticleCount}</div></div>;
    }
  }

}
