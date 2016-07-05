import React from "react";
import { Modal } from 'react-bootstrap';


import Merger from "./merger";

const Confirm = React.createClass({
  mixins: [Merger],
  getDefaultProps() {
    return {
      confirmLabel: 'OK',
      abortLabel: 'Cancel'
    };
  },

  getInitialState() {
    return { showModal: false };
  },

  show() {
    this.setState({ showModal: true });
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  },

  cleanup() {
    this.setState({ showModal: false });
  },

  confirm() {
    this.resolve();
    this.cleanup();
  },

  abort() {
    this.reject();
    this.cleanup();
  },

  render: function() {
    return (
      <Modal ref="modal" show={this.state.showModal}>
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
            {this.props.abortLabel}
          </button>
          <button
            role='confirm'
            type='button'
            className='btn btn-primary m-x-1'
            ref='confirm'
            onClick={this.confirm}
          >
            {this.props.confirmLabel}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
});


export default Confirm ;
