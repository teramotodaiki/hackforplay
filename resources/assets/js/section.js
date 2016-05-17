import React from "react";
import { Element, Link } from "react-scroll";
import classNames from "classNames";

import Merger from "./merger";

const Section = React.createClass({
  mixins: [Merger],
  render () {

    const style = this.m({
      height: '100vh',
    }, this.props.style);

    const rowStyle = this.m({
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'space-around',
      height: '100%',
      textAlign: 'center',
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
  mixins: [Merger],
  render() {
    return (
      <Link activeClass="active" to={this.props.to} spy={true} smooth={true} offset={1} duration={this.props.duration || 500}>
        {this.props.children}
      </Link>
    );
  }
});

export { Section, Scroller };
