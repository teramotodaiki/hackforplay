import React from 'react';
import classNames from "classNames";

class IframeEmbed extends React.Component {

  constructor (props) {
    super(props);

    this.isFocused = false;
  }

  componentDidMount () {
    const { type, code, implicit_mod, autoFocus } = this.props;

    const loadHandler = () => {
      // ---- ドメイン分割に伴い、onfocusイベントがハンドルできない模様 ----
      this.iframe.onfocus = () => {
        this.isFocused = true;
        this.props.onFocus && this.props.onFocus();
        this.forceUpdate();
      };
      this.iframe.onblur = () => {
        this.isFocused = false;
        this.props.onBlur && this.props.onBlur();
        this.forceUpdate();
      };
      // ---- ドメイン分割に伴い、onfocusイベントがハンドルできない模様 ----

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

    this.iframe.onload = loadHandler.bind(this);

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
      <div /*className={classname}*/ style={this.props.style}>
        <div className='embed-responsive embed-responsive-3by2' style={{backgroundColor: 'black'}}>
          <iframe ref={(ref) => this.iframe = ref}></iframe>
        </div>
      </div>
    );
  }

};

export default IframeEmbed;
