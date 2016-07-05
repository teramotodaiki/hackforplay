import React, { Component } from "react";
import { Modal } from 'react-bootstrap';


export default class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      resolve: null,
      reject: null,
    };

    this.show = this.show.bind(this);
    this.cleanup = this.cleanup.bind(this);
    this.confirm = this.confirm.bind(this);
    this.abort = this.abort.bind(this);
  }

  show() {
    this.setState({ showModal: true });
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  cleanup() {
    this.setState({ showModal: false });
  }

  confirm() {
    this.resolve();
    this.cleanup();
  }

  abort() {
    this.reject();
    this.cleanup();
  }

  render() {
    return (
      <Modal show={this.state.showModal}>
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.description}
          {this.props.children}
        </Modal.Body>
        <Modal.Footer>
          <button
            role='abort'
            type='button'
            className='btn btn-default m-x-1'
            onClick={this.abort}
          >
            {this.props.abortLabel || 'Cancel'}
          </button>
          <button
            role='confirm'
            type='button'
            className='btn btn-primary m-x-1'
            ref='confirm'
            onClick={this.confirm}
          >
            {this.props.confirmLabel || 'OK'}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

Confirm.propTypes = {
};
