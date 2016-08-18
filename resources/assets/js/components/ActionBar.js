import React, { Component } from 'react';

import { FlatButton, TextField } from 'material-ui';
import Send from 'material-ui/svg-icons/content/send';
import { white } from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

export default class ActionBar extends Component {
  constructor(props) {
    super(props);

    this.state = { inputValue: '' };

    this.postChatAndClear = this.postChatAndClear.bind(this);
    this.postChatByKey = this.postChatByKey.bind(this);
  }

  postChatAndClear() {
    if (this.state.inputValue) {
      this.props.postChat(this.state.inputValue);
      this.setState({ inputValue: '' });
    }
  }

  postChatByKey({ nativeEvent }) {
    if (nativeEvent.keyCode === 13 && !nativeEvent.shiftKey) {
      this.postChatAndClear();
      nativeEvent.preventDefault();
    }
  }

  render() {
    const { style, disabled } = this.props;

    const divStyle = Object.assign({
      display: 'flex',
      alignItems: 'flex-end',
      width: '100%',
      backgroundColor: white,
    }, style);

    const textWrapStyle = {
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: fade(divStyle.backgroundColor, 0.95),
      flexGrow: 1,
      zIndex: 1,
    }

    const buttonStyle = {
      height: divStyle.height,
    };

    return (<div style={divStyle}>
      <div style={textWrapStyle}>
        <TextField
          name="chat"
          value={this.state.inputValue}
          onChange={(e) => this.setState({ inputValue: e.target.value })}
          onKeyDown={this.postChatByKey}
          disabled={disabled}
          fullWidth={true}
          multiLine={true}
        />
      </div>
      <FlatButton
        label="send"
        onTouchTap={this.postChatAndClear}
        disabled={disabled}
        style={buttonStyle}
        icon={<Send />}
        primary={true}
        labelPosition="before"
      />
    </div>);
  }
}

ActionBar.propTypes = {
};
