import React from "react";
import { Element, Link } from "react-scroll";

import Merger from "./merger";

const Section = React.createClass({
  mixins: [Merger],
  getDefaultProps() {
    return {
      style: {},
      height: "100vh",
      rowClass: "vertical-justify xs-stretch",
    }
  },
  render () {
    const style = this.m(this.props.style, { height: this.props.height });
    return (
      <Element
        className="container-fluid"
        name={this.props.name}
        style={style}
        className={this.props.className}
        >
        <div
          className={this.p({ row: this.props.rowClass }) + ' text-xs-center'}
          style={{ height: "100%" }}>
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
