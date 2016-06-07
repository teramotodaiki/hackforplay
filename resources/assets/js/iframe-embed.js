import React from 'react';
import classNames from "classNames";

class IframeEmbed extends React.Component {

  constructor (props) {
    super(props);

    this.uri = '/embed/?type=stage&id=' + props.id;
  }

  componentDidMount () {

    // focus binding
    const e = this.iframe.contentWindow.addEventListener;
    e('focus', this.props.onFocus);
    e('focus', () => this.forceUpdate());
    e('blur', this.props.onBlur);
    e('blur', () => this.forceUpdate());

    // autoFocus
    if (this.props.autoFocus) {
      this.iframe.focus();
    }

  }

  render () {

    // iframeがfoucsされているか？
    const isFocused = document.activeElement === this.iframe;

    const classname = classNames(this.props.className, {
      'pseudo-focus': isFocused && this.props.visibleFocus
    });


    return (
      <div className={classname} style={this.props.style}>
        <div className='embed-responsive embed-responsive-3by2' style={{backgroundColor: 'black'}}>
          <iframe ref={(ref) => this.iframe = ref } src={this.uri}></iframe>
        </div>
      </div>
    );
  }

};

export default IframeEmbed;
