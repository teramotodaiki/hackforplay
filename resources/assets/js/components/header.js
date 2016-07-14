import React, { Component, PropTypes } from 'react';

import { AppBar, IconMenu, MenuItem, Divider, IconButton, FontIcon, FlatButton, Drawer } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Link } from 'react-router';

const statics = {
  dockMenu: [
    {
      text: 'Our Games',
      href: '/r',
      needAuth: false,
    },
    {
      text: 'Projects',
      href: '/myproject',
      needAuth: true,
    },
    {
      text: 'Channels',
      to: '/channels/list',
      needAuth: true,
    },
    {
      text: 'News',
      to: '/news',
      needAuth: false,
    },
  ],
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
  constructor(props) {
    super(props);

    this.state = {
      open: !!props.openImmediately,
    };
  }

  render() {
    const meta = document.querySelector('meta[name="login-user-id"]');
    const user_id = meta ? meta.getAttribute('content') : null;

    const affix = this.props.affix === undefined || this.props.affix;

    const style = Object.assign(
      affix ? { position: 'fixed' } : {},
      this.props.style);

    return (
      <div>
        <AppBar
          style={style}
          title={this.props.title}
          onLeftIconButtonTouchTap={() => this.setState({ open: !this.state.open })}
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
        {affix ? (
          <div style={{ height: this.context.muiTheme.appBar.height }}></div>
        ) : null}
        <Drawer
          docked={true}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}>
          <AppBar
            title={this.props.title}
            onLeftIconButtonTouchTap={() => this.setState({ open: !this.state.open })} />
            {statics.dockMenu.filter((item) => {
              return !item.needAuth || user_id;
            }).map((item) => (
            <MenuItem
              key={item.text}
              primaryText={item.text}
              containerElement={item.to ? (
                <Link to={item.to} />
              ) : (
                <div></div>
              )}
              onTouchTap={() => {
                if (item.href) {
                  location.href = item.href;
                }
              }}/>
          ))}
        </Drawer>
      </div>
    );
  }
}

Header.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

export default Header;
