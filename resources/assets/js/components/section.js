import React from "react";
import { Element, Link } from "react-scroll";

export const Section = (props) => {

  const style = Object.assign({
    minHeight:  document.documentElement.clientHeight,
    textAlign: 'center',
  }, props.style);

  const rowStyle = Object.assign({
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-around',
    minHeight:  document.documentElement.clientHeight,
    alignItems: 'center',
  }, props.rowStyle);

  return (
    <Element
      name={props.name}
      style={style}
      className={props.className}
      >
      <div
        style={rowStyle}>
        {props.children}
      </div>
    </Element>
  );

};

export const Scroller = (props) => {

  return (
    <Link activeClass="active" to={props.to} spy={true} smooth={true} offset={1} duration={props.duration || 500}>
      {props.children}
    </Link>
  );

};
