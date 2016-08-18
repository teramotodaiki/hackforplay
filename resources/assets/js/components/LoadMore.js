import React, {PropTypes, Component} from 'react';
import { findDOMNode } from 'react-dom';

import {
  LinearProgress,
} from 'material-ui';

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
    if (!this.progress || this.state.isFetching) return;
    const rect = this.progress.getBoundingClientRect();
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
    const style = {
      opacity: this.state.isFetching ? 1 : 0,
    };

    return (
      <LinearProgress
        ref={(element) => this.progress = findDOMNode(element)}
        mode="indeterminate"
        style={style}
      />
    );
  }
}

LoadMore.propTypes = {
  handleLoad: PropTypes.func.isRequired,
};
