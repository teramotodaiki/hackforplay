import React from 'react';
import { scroller } from "react-scroll";

import Merger from "./merger";
import { Section, Scroller } from "./section";

const statics = {
  title: 'The Beginning',
  hintTitle: 'How to solve',
  style: {
    backgroundColor: 'rgb(190,233,213)'
  },
  colors: {
    main: 'gray-dark',
    sub: 'gray-lightest',
    levels: [
      null,
      'rgb(190,233,213)', // Level-1
      'rgb(255,251,223)', // Level-2
      'rgb(253,180,151)', // Level-3
      'rgb(255,138,121)', // Level-4
      'rgb(144, 71, 88)', // Level-5
      'rgb( 67, 26, 36)'  // Level-6
    ]
  },
  hfp: 'embed/?type=stage&id=',
  yt: 'https://www.youtube.com/embed/'

};

// App
const Tutorials = React.createClass({
  mixins: [Merger],
  getInitialState() {
    return {
      levels: [
        { id: 1, title: 'Begining', youtube: 'od61KliPeJI',
          colorName: statics.colors.main, linkTo: 'Level-2' },
        { id: 2, title: 'Secondly', youtube: 'od61KliPeJI',
          colorName: statics.colors.main, linkTo: 'Level-3' },
        { id: 3, title: 'Thirdly', youtube: 'od61KliPeJI',
          colorName: statics.colors.main, linkTo: 'Level-4' },
        { id: 4, title: 'Forthly', youtube: 'od61KliPeJI',
          colorName: statics.colors.sub, linkTo: 'Level-5' },
        { id: 5, title: 'Fifthly', youtube: 'od61KliPeJI',
          colorName: statics.colors.sub, linkTo: 'Level-6' },
        { id: 6, title: 'Sixly', youtube: 'od61KliPeJI',
          colorName: statics.colors.sub, linkTo: 'Dialog' }
      ],
      activeLevelId: null
    }
  },
  componentDidMount() {
    scroller.scrollTo('Landing', {
      duration: 0,
      delay: 0,
      smooth: true,
    });
  },
  changeActiveState(id, state) {
    // EmbedStage ifame が focus または blus された時のEvent Hundler
    if (state) {
      this.setState({ activeLevelId: id });
    } else if (!state && this.state.activeLevelId === id) {
      this.setState({ activeLevelId: null });
    }
  },
  render () {
    const levels = this.state.levels.map((item) => {
      return <Level
        info={this.m(item, {
          changeActiveState: this.changeActiveState,
          isActive: this.state.activeLevelId===item.id
        })}
        key={item.id} />;
    });
    return (
      <div style={statics.style}>
        {levels}
        <Dialog />
        <Landing />
      </div>
    );
  }
});

// Containers
const Landing = React.createClass({
  mixins: [Merger],
  render() {
    return (
      <Section name="Landing" height="100vh">
        <div className={this.p({ text: 'xs-center ' + statics.colors.main})}>
          <h1>{statics.title}</h1>
        </div>
        <div className={this.p({ text: 'xs-center ' + statics.colors.main})}>
          <Scroller to="Level-1" duration={1500}>
            <span className="btn btn-link">
              <span className="fa fa-rocket fa-10x fa-rotate-315" />
            </span>
          </Scroller>
        </div>
      </Section>
    );
  }
});

const Level = React.createClass({
  mixins: [Merger],
  render() {
    const info = this.props.info;
    return (
      <Section name={'Level-' + info.id} height="100vh"
        style={{ backgroundColor: statics.colors.levels[info.id] }}>
        <div className="container-fluid">
          <div className={this.p({ row: 'horizontal-justify xs-bottom' })}>
            <EmbedStage info={info} />
            <EmbedYoutube info={info} />
          </div>
        </div>
        <div className="text-xs-center">
          <Scroller to={info.linkTo}>
            <span className={this.p({ btn: info.colorName + '-outline lg' })}>
              <span className="fa fa-arrow-down fa-2x"></span>
            </span>
          </Scroller>
        </div>
      </Section>
    );
  }
});

const Dialog = React.createClass({
  mixins: [Merger],
  render() {
    return (
      <Section name="Dialog" height="100vh">
        <div className={this.p({ text: 'xs-center ' + statics.colors.main })}>
          ☆*:.｡.<span className="fa fa-trophy fa-10x" />.｡.:*☆
        </div>
        <div className={this.p({ text: 'xs-center ' + statics.colors.main })}>
          <p>
            Play more <span className="fa fa-gamepad fa-lg" />
          </p>
          <a href="r" className={this.p({ btn: statics.colors.main + '-outline lg' })}>
            <span className="fa fa-users fa-4x" />
          </a>
        </div>
        <div className={this.p({ text: 'xs-center ' + statics.colors.main })}>
          <p>
            or,<br />Make your
            <span className="fa fa-stack fa-lg">
              <i className="fa fa-sign-language fa-stack-2x" />
              <i className="fa fa-gamepad fa-stack-1x fa-inverse" />
            </span>
          </p>
          <a href="getaccount" className={this.p({ btn: statics.colors.main + '-outline lg' })}>
            <span className="fa fa-user-plus fa-2x" />
          </a>
        </div>
      </Section>
    );
  }
});

// UI Parts
const EmbedStage = React.createClass({
  mixins: [Merger],
  componentDidMount() {
    const info = this.props.info;
    this.iFrame.contentWindow.onfocus = (event) => {
      info.changeActiveState(info.id, true);
    };
    this.iFrame.contentWindow.onblur = (event) => {
      info.changeActiveState(info.id, false);
    };
    window.addEventListener('scroll', () => {
      const rect = this.iFrame.getClientRects()[0];
      if (!info.isActive && rect.top >= 0 && rect.bottom <= window.innerHeight) {
        // Auto focus when iframe contains viewport
        this.iFrame.focus();
      }
    });
  },
  render() {
    const info = this.props.info;
    return (
      <div className="col-xs-7">
        <h2 className={'text-' + info.colorName}>
          <span className="fa fa-gamepad" />-{info.id} {info.title}
        </h2>
        <div className={info.isActive ? 'pseudo-focus' : ''}>
          <div className={this.p({ 'embed-responsive': '3by2' })} style={{backgroundColor: 'black'}}>
            <iframe ref={(ref) => this.iFrame = ref } src={statics.hfp + info.id}></iframe>
          </div>
        </div>
      </div>
    );
  }
});

const EmbedYoutube = React.createClass({
  mixins: [Merger],
  render() {
    const info = this.props.info;
    return (
      <div className="col-xs-5">
        <h3 className={'text-' + info.colorName}>
          <span className="fa fa-question"></span>
          <span className="fa fa-frown-o"></span>
          <span className="fa fa-long-arrow-right"></span>
          <span className="fa fa-youtube-play"></span>
          <span className="fa fa-meh-o"></span>
          <span className="fa fa-long-arrow-right"></span>
          <span className="fa fa-lightbulb-o"></span>
          <span className="fa fa-smile-o"></span>
        </h3>
        <div className={this.p({ 'embed-responsive': '16by9' })} style={{backgroundColor: 'black'}}>
          <iframe src={statics.yt + info.youtube}></iframe>
        </div>
      </div>
    );
  }
});

const Choise = React.createClass({
  mixins: [Merger],
  render() {
    const info = this.props.info;
    return (
      <div className={this.p({ text: 'xs-center ' + statics.colors.main })}>
        <p>{info.message}</p>
        <button className={this.p({ btn: statics.colors.main + '-outline lg' })}>{info.value}</button>
      </div>
    );
  }
});


export default Tutorials
