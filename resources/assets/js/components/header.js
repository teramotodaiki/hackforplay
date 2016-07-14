import React, { Component, PropTypes } from 'react';
import { AppBar, IconMenu, MenuItem, Divider, IconButton, FontIcon } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const statics = {
  userMenu: [
    [
      {
        text: 'MyPage',
        href: '/m',
      },
      {
        text: 'Projects',
        href: '/myproject'
      },
      {
        text: 'Settings',
        href: '/p'
      },
      {
        text: 'Comments',
        href: '/comments'
      },
      {
        text: 'Dashboard (beta)',
        href: '/dashboard'
      },
    ],
    [
      {
        text: 'Sign out',
        href: '/auth/signout_and_gotolandingpage.php'
      },
    ]
  ]
};

class Header extends Component {

  render() {
    const style = Object.assign({
      position: 'fixed',
    }, this.props.style);

    const menu = statics.userMenu.map((block) => {
      return block.map((item) => (
        <MenuItem
          key={item.text}
          primaryText={item.text}
          onTouchTap={() => window.location.href = item.href}
          />
      ));
    }).reduce((p, c, i) => p.concat(<Divider key={'Divider-' + i} />, c));

    return (
      <div>
        <AppBar
          title={this.props.title}
          iconElementRight={
            <IconMenu
              iconButtonElement={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              anchorOrigin={{"horizontal":"right","vertical":"bottom"}}
              targetOrigin={{"horizontal":"right","vertical":"top"}}>
              {menu}
            </IconMenu>
          }
          />
        <div style={{ height: this.context.muiTheme.appBar.height }}></div>
      </div>
    );
  }
}

Header.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

export default Header;
