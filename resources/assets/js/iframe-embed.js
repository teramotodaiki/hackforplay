import React from 'react';
import classNames from "classNames";

class IframeEmbed extends React.Component {

  constructor (props) {
    super(props);

    this.isFocused = false;
  }

  componentDidMount () {

    // focus binding
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
    if (this.props.autoFocus) {
      this.iframe.focus();
    }

  }

  render () {

    const classname = classNames(this.props.className, {
      'pseudo-focus': this.isFocused && this.props.visibleFocus
    });

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

    const uri = '/embed/?' + params.filter((p) => p).join('&');

    return (
      <div className={classname} style={this.props.style}>
        <div className='embed-responsive embed-responsive-3by2' style={{backgroundColor: 'black'}}>
          <iframe ref={(ref) => this.iframe = ref } src={uri}></iframe>
        </div>
      </div>
    );
  }

};

export default IframeEmbed;
