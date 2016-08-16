import React from 'react';
import classNames from "classNames";

class IframeEmbed extends React.Component {

  constructor (props) {
    super(props);

    this.isFocused = false;
  }

  componentDidMount () {
    const { type, code, implicit_mod, autoFocus } = this.props;

    this.iframe.onload = () => {
      console.log('onload!');
      // focus binding
      console.log(this.iframe.contentWindow.addEventListener, this.iframe.addEventListener);
      const e = this.iframe.contentWindow.addEventListener;
      // focus process
      e('focus', () => this.isFocused = true);
      e('focus', this.props.onFocus);
      e('focus', () => this.forceUpdate());
      // blur process
      e('blur', () => this.isFocused = false);
      e('blur', this.props.onBlur);
      e('blur', () => this.forceUpdate());

      // autoFocus
      if (autoFocus) {
        this.iframe.focus();
      }

      // code
      if (type === 'code') {
        this.iframe.contentWindow.postMessage({
          query: 'require',
          dependencies: implicit_mod && [implicit_mod],
          code: code,
        }, '*');
      }
    };

    // load game
    this.iframe.src = this.getSrc();
  }

  getSrc() {
    const {
      type,
      id,
      token
    } = this.props;

    const params = [
      type  ? `type=${type}`    : 'type=stage',
      id    ? `id=${id}`        : null,
      token ? `token=${token}`  : null,
    ];

    return (
      location.hostname === 'hackforplay.xyz' ?
      'https://embed.hackforplay.xyz/hackforplay/index.html' :
      location.hostname === 'hackforplay-staging.azurewebsites.net' ?
      'https://hackforplay.blob.core.windows.net/hackforplay-staging/index.html' :
      '/embed/'
    ) + '?' + params.filter((p) => p).join('&');
  }

  render () {

    const classname = classNames(this.props.className, {
      'pseudo-focus': this.props.visibleFocus,
      'pseudo-focus-on': this.isFocused && this.props.visibleFocus,
    });

    return (
      <div className={classname} style={this.props.style}>
        <div className='embed-responsive embed-responsive-3by2' style={{backgroundColor: 'black'}}>
          <iframe ref={(ref) => this.iframe = ref}></iframe>
        </div>
      </div>
    );
  }

};

export default IframeEmbed;
