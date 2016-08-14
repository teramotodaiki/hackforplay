import React, {PropTypes} from 'react';

import {
  Drawer, AppBar, IconButton,
  FlatButton, TextField,
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
            value={this.state.name}
            onChange={(event, input) => this.setState({ name: input })}
          />
        </div>
        <div style={{ padding: 20, textAlign: 'right' }}>
          <FlatButton
            label="OK"
            primary={true}
          />
        </div>
      </Drawer>
    );
  }
}

AuthorDrawer.propTypes = {
};
