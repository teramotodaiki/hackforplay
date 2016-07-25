import React, { Component, PropTypes } from 'react';

import { AppBar, IconMenu, MenuItem, Divider, IconButton, FontIcon, FlatButton, Drawer } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { getAuthUser } from '../actions/';

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

var _lastOpenedState = null;

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: !!props.openImmediately,
      user: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(getAuthUser())
    .then((user) => this.setState({ user }));
  }

  componentDidUpdate() {
    if (_lastOpenedState !== this.state.open && this.props.onToggleDrawer) {
      this.props.onToggleDrawer(this.state.open);
    }
    _lastOpenedState = this.state.open;
  }

  render() {
    const { user } = this.state;

    const affix = this.props.affix === undefined || this.props.affix;

    const style = Object.assign(
      affix ? { position: 'fixed' } : {},
      this.props.style);

    return (
      <div>
        <AppBar
          style={style}
          onLeftIconButtonTouchTap={() => this.setState({ open: !this.state.open })}
          iconElementRight={user ? (
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
              return !item.needAuth || user;
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

Header.propTypes = {
  onToggleDrawer: PropTypes.function,
}

Header.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Header);
