import React from "react";
import { Element, Link } from "react-scroll";
import { Col, Panel } from 'react-bootstrap';


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

export const CardSection = (props) => {

  const header = (
    <h1 style={{ textAlign: 'center' }}>{props.header || props.name}</h1>
  );
  const footer = props.descriptions ? (
    <ul>
      {props.descriptions.filter(i => i).map(i => <li key={i}>{i}</li>)}
    </ul>
  ) : null;
  const spacer = <div style={{ height: '1.5rem' }} />;
  const style = Object.assign({ textAlign: 'left' }, props.style);

  return (
    <Section name={props.name} style={style}>
      <div />
      <Col xs={11} sm={9} md={8} lg={7}>
        <Panel header={header} footer={footer}>
          {spacer}
          {props.children}
          {spacer}
        </Panel>
      </Col>
      <Arrow to={props.next} onClick={props.onMoveNext} />
    </Section>
  );
};

export const Scroller = (props) => {

  return (
    <Link activeClass="active" to={props.to} spy={true} smooth={true} offset={1} duration={props.duration || 500}>
      {props.children}
    </Link>
  );

};

export const Arrow = (props) => {
  const faClass = props.faClass || 'fa fa-arrow-down fa-2x';
  const addDefault = Object.assign({
    smooth: true
  }, props);
  return (
    <Link {...addDefault}>
      <span className="btn btn-lg">
        <span className={faClass}></span>
      </span>
    </Link>
  )
};
