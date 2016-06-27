import React from "react";
import { Element, Link } from "react-scroll";
import classNames from "classNames";

const Section = React.createClass({
  render () {

    const style = Object.assign({
      height: '100vh',
      textAlign: 'center',
    }, this.props.style);

    const rowStyle = Object.assign({
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'space-around',
      height: '100%',
      alignItems: 'center',
    }, this.props.rowStyle);

    return (
      <Element
        name={this.props.name}
        style={style}
        className={this.props.className}
        >
        <div
          style={rowStyle}>
          {this.props.children}
        </div>
      </Element>
    )
  }
});

const Scroller = React.createClass({
  render() {
    return (
      <Link activeClass="active" to={this.props.to} spy={true} smooth={true} offset={1} duration={this.props.duration || 500}>
        {this.props.children}
      </Link>
    );
  }
});

export { Section, Scroller };
