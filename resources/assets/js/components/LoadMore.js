import React, {PropTypes, Component} from 'react';
import { findDOMNode } from 'react-dom';

import {
  LinearProgress,
} from 'material-ui';

import Progress from './Progress';

export default class LoadMore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.loadIfAppeared());
    window.addEventListener('scroll', () => this.loadIfAppeared());
    this.loadIfAppeared();
  }

  loadIfAppeared() {
    const { onLoaded } = this.props;
    if (!this.sensor || this.state.isFetching) return;
    const rect = this.sensor.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {

      this.setState({ isFetching: true });

      this.props.handleLoad()
      .then((result) => {
        (onLoaded ? onLoaded(result) : Promise.resolve())
        .then(() => {
          this.setState({ isFetching: false });
          // this.loadIfAppeared();
        })
      });

    }
  }

  render() {
    const { isFetching } = this.state;
    const { first } = this.props;

    return (<div>
      <div ref={(e) => this.sensor = findDOMNode(e)} />
      {isFetching ? (
        first ?
          <Progress size={this.props.size} /> :
          <LinearProgress mode="indeterminate" />
      ) : null}
    </div>);
  }
}

LoadMore.propTypes = {
  handleLoad: PropTypes.func.isRequired,
};
