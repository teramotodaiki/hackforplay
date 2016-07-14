import React, { Component, PropTypes } from 'react';
import { AppBar, IconMenu, MenuItem, Divider, IconButton, FontIcon, FlatButton } from 'material-ui';
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
    const meta = document.querySelector('meta[name="login-user-id"]');
    const user_id = meta ? meta.getAttribute('content') : null;

    const style = Object.assign({
      position: 'fixed',
    }, this.props.style);

    return (
      <div>
        <AppBar
          style={style}
          title={this.props.title}
          iconElementRight={user_id ? (
            <IconMenu
              iconButtonElement={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              anchorOrigin={{"horizontal":"right","vertical":"bottom"}}
              targetOrigin={{"horizontal":"right","vertical":"top"}}>
              {statics.userMenu.map((block) => {
                return block.map((item) => (
                  <MenuItem
                    key={item.text}
                    primaryText={item.text}
                    onTouchTap={() => window.location.href = item.href}
                    />
                ));
              }).reduce((p, c, i) => p.concat(<Divider key={'Divider-' + i} />, c))}
            </IconMenu>) : (
              <FlatButton
                label="Login"
                onTouchTap={() => window.location.href = '/login'}
                />
            )
          }>
        </AppBar>
        <div style={{ height: this.context.muiTheme.appBar.height }}></div>
      </div>
    );
  }
}

Header.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

export default Header;
