import React from 'react';
import { Link as ScrollLink, Element as ScrollTarget } from "react-scroll";

import Merger from "./merger";
import { Section, Scroller } from "./section";

const statics = {
  title: 'The Begining',
  description: 'Here is a first adventure of HackforPlay! Are you ready?',
  buttonText: 'Start',
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
  }

};

// App
const Tutorials = React.createClass({
  getInitialState() {
    return {
      levels: [
        { id: 1, title: 'Stage 1: Begining', youtube: 'od61KliPeJI',
          colorName: statics.colors.main,
          link: { value: 'Next Level', to: 'Level-2' } },
        { id: 2, title: 'Stage 2: Secondly', youtube: 'od61KliPeJI',
          colorName: statics.colors.main,
          link: { value: 'Next Level', to: 'Level-3' } },
        { id: 3, title: 'Stage 3: Thirdly', youtube: 'od61KliPeJI',
          colorName: statics.colors.main,
          link: { value: 'Next Level', to: 'Level-4' } },
        { id: 4, title: 'Stage 4: Forthly', youtube: 'od61KliPeJI',
          colorName: statics.colors.sub,
          link: { value: 'Next Level', to: 'Level-5' } },
        { id: 5, title: 'Stage 5: Fifthly', youtube: 'od61KliPeJI',
          colorName: statics.colors.sub,
          link: { value: 'Next Level', to: 'Level-6' } },
        { id: 6, title: 'Stage 6: Sixly', youtube: 'od61KliPeJI',
          colorName: statics.colors.sub,
          link: { value: 'Last Step', to: 'Dialog' } }
      ],
      choises: [
        { message: 'If you want to play more stages, click here', value: 'PLAYGROUND' },
        { message: 'If you want to create your stage, click here', value: 'SIGN UP' },
      ]
    }
  },
  render () {
    const levels = this.state.levels.map((item) => {
      return <Level info={item} key={item.id} />;
    });
    return (
      <div style={statics.style}>
        <Header />
        {levels}
        <Dialog choises={this.state.choises} />
      </div>
    );
  }
});

// Containers
const Header = React.createClass({
  mixins: [Merger],
  render() {
    return (
      <Section name="Header" height="100vh">
        <div className={this.p({ text: 'xs-center ' + statics.colors.main})}>
          <h1>{statics.title}</h1>
          <h2>{statics.description}</h2>
        </div>
        <div className="text-xs-center">
          <Scroller to="Level-1">
            <span className={this.p({ btn: statics.colors.main + '-outline lg' })}>
              {statics.buttonText}
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
          <Scroller to={info.link.to}>
            <span className={this.p({ btn: info.colorName + '-outline lg' })}>
              {info.link.value}
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
    const choises = this.props.choises.map((item) => {
      return <Choise info={item} key={item.value}></Choise>;
    });
    return (
      <Section name="Dialog" height="100vh">
        {choises}
      </Section>
    );
  }
});

// UI Parts
const EmbedStage = React.createClass({
  mixins: [Merger],
  render() {
    const info = this.props.info;
    return (
      <div className="col-xs-7">
        <h2 className={'text-' + info.colorName}>{info.title}</h2>
        <div className={this.p({ 'embed-responsive': '4by3' })} style={{backgroundColor: 'black'}}>
          <iframe ></iframe>
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
        <h3 className={'text-' + info.colorName}>{statics.hintTitle}</h3>
        <div className={this.p({ 'embed-responsive': '16by9' })} style={{backgroundColor: 'black'}}>
          <iframe ></iframe>
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
