import React from "react";

import Merger from "./merger";

const Modal = React.createClass({
  show() {
    $(this.refs.modal).modal('show');
  },
  hide() {
    $(this.refs.modal).modal('hide');
  },
  render () {
    return (
      <div ref="modal"
        className='modal fade'
        tabIndex='-1'
        role='dialog'
        aria-hidden='false'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

const Confirm = React.createClass({
  mixins: [Merger],
  getDefaultProps() {
    return {
      confirmLabel: 'OK',
      abortLabel: 'Cancel'
    };
  },

  show() {
    this.refs.modal.show();
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  },

  cleanup() {
    this.refs.modal.hide();
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
      <Modal ref="modal">
        <div className='modal-header'>
          <h4 className='modal-title'>
            {this.props.title}
          </h4>
        </div>
        <div className='modal-body'>
          {this.props.description}
        </div>
        <div className='modal-footer'>
          <div className='text-right'>
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
          </div>
        </div>
      </Modal>
    );
  }
});


export default Confirm ;
