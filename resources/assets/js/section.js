import React from "react";
import { Element, Link } from "react-scroll";

import Merger from "./merger";

const Section = React.createClass({
  mixins: [Merger],
  render () {
    return (
      <Element
        className="container-fluid"
        name={this.props.name}
        style={this.m(this.props.style || {}, { height: this.props.height })}>
        <div
          className={this.p({ row: 'vertical-justify' })}
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
      <Link activeClass="active" to={this.props.to} spy={true} smooth={true} offset={1} duration={500}>
        {this.props.children}
      </Link>
    );
  }
});

export { Section, Scroller };
