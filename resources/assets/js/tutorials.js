import React from 'react';
import { scroller } from "react-scroll";
import Confirm from "./confirm";

import Merger from "./merger";
import { Section, Scroller } from "./section";

const statics = {
  title: 'The Beginning',
  hintTitle: 'How to solve',
  descriptions: {
    youtube: 'Here is a hint movie',
    next: "After cleared this stage then let's go to next stage!"
  },
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
  yt: 'https://www.youtube.com/embed/',
  dialog: {
    header: 'Awesome!!',
    description : 'There are 500+ stages in HackforPlay! Try it out',
    button: 'Play more'
  },
  confirm: {
    title: 'Did you clear this stage?',
    description: "Let's go to the next stage! Of cource you can return this stage later"
  },
  shareTweetURL: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('https://hackforplay.xyz/tutorials'),
  searchURL: 'https://twitter.com/search?q=hackforplay'
};

// App
const Tutorials = React.createClass({
  mixins: [Merger],
  getInitialState() {
    return {
      levels: [
        { id: 1, title: 'Begining', youtube: 'od61KliPeJI', showDescription: true,
          colorName: statics.colors.main, linkTo: 'Level-2' },
        { id: 2, title: 'Secondly', youtube: 'mLBb7WQTjoo',
          colorName: statics.colors.main, linkTo: 'Level-3' },
        { id: 3, title: 'Thirdly', youtube: 'no7ch0jTHRc',
          colorName: statics.colors.main, linkTo: 'Level-4' },
        { id: 4, title: 'Forthly', youtube: 'qpjTVkrOvHg',
          colorName: statics.colors.sub, linkTo: 'Level-5' },
        { id: 5, title: 'Fifthly', youtube: 'HzDbGgmi0bA',
          colorName: statics.colors.sub, linkTo: 'Level-6' },
        { id: 6, title: 'Sixly', youtube: '4L0qPyUaH0A',
          colorName: statics.colors.sub, linkTo: 'Dialog' }
      ],
      activeLevelId: null
    }
  },
  changeActiveState(id, state) {
    // EmbedStage ifame が focus または blus された時のEvent Hundler
    if (state) {
      this.setState({ activeLevelId: id });
    } else if (!state && this.state.activeLevelId === id) {
      this.setState({ activeLevelId: null });
    }
  },
  confirm(options) {
    return this.refs.confirm.show(options);
  },
  setConfirmOption(options) {
    this.setState({ confirmOptions: options });
  },
  render () {
    const levels = this.state.levels.map((item) => {
      return <Level
        info={this.m(item, {
          changeActiveState: this.changeActiveState,
          isActive: this.state.activeLevelId===item.id
        })}
        confirm={this.confirm}
        key={item.id} />;
    });
    return (
      <div>
        <Confirm ref="confirm" {...statics.confirm} set={this.setConfirmOption} />
        <div style={statics.style}>
          <Landing />
          {levels}
          <Dialog {...statics.dialog} />
        </div>
      </div>
    );
  }
});

// Containers
const Landing = React.createClass({
  mixins: [Merger],
  render() {
    return (
      <Section name="Landing">
        <div></div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-lg-6 col-lg-offset-3">
              <img src="image/tutorials-landing.png" className="img-fluid" />
            </div>
          </div>
        </div>
        <div className={this.p({ text: 'xs-center ' + statics.colors.main})}>
          <Scroller to="Level-1">
            <span className={this.p({ btn: statics.colors.main + '-outline lg' })}>
              <span className="fa fa-arrow-down fa-2x"></span>
            </span>
          </Scroller>
        </div>
      </Section>
    );
  }
});

const Level = React.createClass({
  mixins: [Merger],
  onClick() {
    const confirm = this.props.confirm;
    confirm().then(() => {
      scroller.scrollTo(this.props.info.linkTo, { smooth: true });
    });
  },
  render() {
    const info = this.props.info;
    const next = info.showDescription ? (
      <div>
        <p>
          <small className="text-muted m-l-1">
            {statics.descriptions.next}
          </small>
        </p>
        <button
          onClick={this.onClick}
          className={this.p({ btn: info.colorName + '-outline lg' })}
          >
          <span className="fa fa-arrow-down fa-2x"></span>
        </button>
      </div>
    ) : (
      <Scroller to={info.linkTo}>
        <span className={this.p({ btn: info.colorName + '-outline lg' })}>
          <span className="fa fa-arrow-down fa-2x"></span>
        </span>
      </Scroller>
    );

    return (
      <Section name={'Level-' + info.id}
        style={{ backgroundColor: statics.colors.levels[info.id] }}>
        <div className="container-fluid">
          <div className={this.p({ row: 'xs-bottom' })}>
            <EmbedStage className="col-sm-7 col-xs-12" info={info} />
            <EmbedYoutube className="col-sm-5 col-xs-12" info={info} />
          </div>
        </div>
        <div className="text-xs-center">
          {next}
        </div>
      </Section>
    );
  }
});

const Dialog = React.createClass({
  mixins: [Merger],
  render() {
    const backgroundStyle = {
      backgroundImage: 'url(image/tutorials-dialog.png)',
      backgroundPosition: 'center',
      backgroundSize: 'cover'
    };
    return (
      <Section name="Dialog" style={backgroundStyle}>
        <div />
        <div />
        <div className="col-xs-center">
          <div className="card card-block text-xs-center p-b-0">
            <h1 className="card-title">{this.props.header}</h1>
            <p className="card-text">{this.props.description}</p>
            <a href="r" className={this.p({ btn: 'primary lg' })}>
              <h2>{this.props.button}</h2>
            </a>
            <div className="m-t-2">
              <a target="_blank" href={statics.shareTweetURL}>
                <span className="fa fa-twitter-square fa-3x" />
              </a>
              <a target="_blank" href={statics.searchURL} className="btn btn-link m-b-2">
                #hackforplay
              </a>
            </div>
          </div>
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
      const isActive = document.activeElement === this.iFrame;
      if (!info.isActive && rect.top >= 0 && rect.bottom <= window.innerHeight) {
        // Auto focus when iframe contains viewport
        this.iFrame.focus();
      }
    });
  },
  render() {
    const info = this.props.info;
    return (
      <div className={this.props.className}>
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
      <div className={this.props.className}>
        <h3 className={'text-' + info.colorName}>
          <span className="fa fa-question"></span>
          <span className="fa fa-frown-o"></span>
          <span className="fa fa-long-arrow-right"></span>
          <span className="fa fa-youtube-play"></span>
          <span className="fa fa-meh-o"></span>
          <span className="fa fa-long-arrow-right"></span>
          <span className="fa fa-lightbulb-o"></span>
          <span className="fa fa-smile-o"></span>
          <small className={info.showDescription ? 'text-muted m-l-1' : 'collapse'}>
            {statics.descriptions.youtube}
          </small>
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
