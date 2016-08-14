import React, { PropTypes, Component } from 'react';

import {
  Drawer, AppBar, IconButton,
  FlatButton, TextField,
  Paper,
} from 'material-ui';

import SettingsInputComponent from 'material-ui/svg-icons/action/settings-input-component';

export default class AuthorDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
    };
  }

  render() {
    const { name } = this.state;
    const { handlePostAuthor } = this.props;
    const { drawer } = this.context.muiTheme;
    const exampleLabel = 'super-mod';

    return (
      <Drawer
        open={true}
        openSecondary={true}
      >
        <AppBar
          title="MOD Author"
          iconElementLeft={
            <IconButton>
              <SettingsInputComponent />
            </IconButton>
          }
        />
        <div style={{ padding: 20 }}>
          <div>This is an account needed to make a MOD.</div>
          <TextField
            floatingLabelText="Author Name"
            hintText="e.g. coolest-hacker"
            fullWidth={true}
            value={name}
            onChange={(event, name) => this.setState({ name })}
          />
        </div>
        <div style={{ padding: 20, textAlign: 'right' }}>
          <FlatButton
            label="OK"
            primary={true}
            onTouchTap={() => handlePostAuthor({ name })}
          />
        </div>
        {name ? (
          <Paper style={{ margin: 10, padding: 10, width: drawer.width - 20 }}>
            <div>example:</div>
            <div style={{ fontSize: 'small' }}>If MOD's name is <b>{exampleLabel}</b>,</div>
            <TextField
              name="example"
              value={`require('${name}/${exampleLabel}');`}
              multiLine={true}
              disabled={true}
              fullWidth={true}
            />
          </Paper>
        ) : null}
      </Drawer>
    );
  }
}

AuthorDrawer.propTypes = {
  handlePostAuthor: PropTypes.func.isRequired,
};

AuthorDrawer.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};
