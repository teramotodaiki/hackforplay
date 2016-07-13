import React, { Component, PropTypes } from 'react';
import { AppBar } from 'material-ui';

class Header extends Component {

  render() {
    const style = Object.assign({
      position: 'fixed',
    }, this.props.style);

    return (
      <div>
        <AppBar style={style} />
        <div style={{ height: this.context.muiTheme.appBar.height }}></div>
      </div>
    );
  }
}

Header.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

export default Header;
