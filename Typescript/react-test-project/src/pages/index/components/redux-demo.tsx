import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store'

class ReduxDemo extends React.Component {
  render() {
    return (
      <div>
        <div>{ this.props.name }</div>
        <button onClick={ () => {
          this.props.setName('为爱起航');
        } }>起飞</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    name: state.name
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setName: bindActionCreators(actions.setName, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxDemo);
