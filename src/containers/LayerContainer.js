import React from 'react';
import { connect } from 'react-redux';
import Layer from 'components/Layer/Layer';

const LayerContainer = (props) => {
  return <Layer {...props} />;
};

export default connect(
  (props) => (props)
)(LayerContainer);
