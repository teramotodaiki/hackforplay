import React from 'react'

const statics = {
  title: 'The Begining',
  description: 'Here is a first adventure of HackforPlay! Are you ready?',
  hintTitle: 'How to solve',
  style: {
    backgroundColor: 'rgb(190,233,213)'
  }
};

// App
const Tutorials = React.createClass({
  getInitialState() {
    return {
      levels: [
        { id: 1, title: 'Stage 1: Begining', youtube: 'od61KliPeJI', value: 'Next Level',
          style: { backgroundColor: 'rgb(190,233,213)' } },
        { id: 2, title: 'Stage 2: Secondly', youtube: 'od61KliPeJI', value: 'Next Level',
          style: { backgroundColor: 'rgb(255,251,223)' } },
        { id: 3, title: 'Stage 3: Thirdly', youtube: 'od61KliPeJI', value: 'Next Level',
          style: { backgroundColor: 'rgb(253,180,151)' } },
        { id: 4, title: 'Stage 4: Forthly', youtube: 'od61KliPeJI', value: 'Next Level',
          style: { backgroundColor: 'rgb(255,138,121)' } },
        { id: 5, title: 'Stage 5: Fifthly', youtube: 'od61KliPeJI', value: 'Next Level',
          style: { backgroundColor: 'rgb(144,71,88)' } },
        { id: 6, title: 'Stage 6: Sixly', youtube: 'od61KliPeJI', value: 'Last Step',
          style: { backgroundColor: 'rgb(67,26,36)' } },
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
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12">
            <h1>{statics.title}</h1>
            <h2>{statics.description}</h2>
          </div>
        </div>
      </div>
    );
  }
});

const Level = React.createClass({
  render() {
    const info = this.props.info;
    return (
      <div className="container-fluid" style={info.style}>
        <div className="row">
          <EmbedStage id={info.id} title={info.title} />
          <EmbedYoutube youtube={info.youtube} />
        </div>
        <div className="row">
          <NextLevel value={info.value} />
        </div>
      </div>
    );
  }
});

const Dialog = React.createClass({
  render() {
    const choises = this.props.choises.map((item) => {
      return <Choise message={item.message} value={item.value} key={item.value}></Choise>;
    });
    return (
      <div className='container'>
        <div className='row'>
          {choises}
        </div>
      </div>
    );
  }
});

// UI Parts
const EmbedStage = React.createClass({
  render() {
    return (
      <div className="col-xs-7">
        <h2>{this.props.title}</h2>
        <iframe id={this.props.id} ></iframe>
      </div>
    );
  }
});

const EmbedYoutube = React.createClass({
  render() {
    return (
      <div className="col-xs-5">
        <h3>{statics.hintTitle}</h3>
        <iframe youtube={this.props.youtube}></iframe>
      </div>
    );
  }
});

const NextLevel = React.createClass({
  render() {
    return (
      <div className="col-xs-12">
        <button>{this.props.value}</button>
      </div>
    );
  }
});

const Choise = React.createClass({
  render() {
    return (
      <div className="col-xs-12">
        <p>{this.props.message}</p>
        <button>{this.props.value}</button>
      </div>
    );
  }
});


export default Tutorials
