import React from 'react';
import ReactDOM from 'react-dom';
import { Notification } from 'react-pnotify';

export default class Notificator extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      notification: {}
    }
  }

  notice(opts = {}) {
    let defaultOpts = {
      type: 'notice',
      title: '提示',
      delay: 500,
      shadow: false,
      hide: true,
      nonblock: true,
      desktop: true
    };

    this.addNotify(_.merge(defaultOpts, opts));
  }

  success(opts = {}) {
    let defaultOpts = {
      type: 'success',
      title: '提示',
      delay: 500,
      shadow: false,
      hide: true,
      nonblock: true,
      desktop: true
    };

    this.addNotify(_.merge(defaultOpts, opts));
  }

  error(opts = {}) {
    let defaultOpts = {
      type: 'error',
      title: '提示',
      delay: 500,
      shadow: false,
      hide: true,
      nonblock: true,
      desktop: true
    };

    this.addNotify(_.merge(defaultOpts, opts));
  }

  info(opts = {}) {
    let defaultOpts = {
      type: 'info',
      title: '提示',
      delay: 500,
      shadow: false,
      hide: true,
      nonblock: true,
      desktop: true
    };

    this.addNotify(_.merge(defaultOpts, opts));
  }

  addNotify(opts = {}) {
    this.setState({
      notification: {
        ...opts,
        display: true
      }
    });
  }

  render() {
    const { display } = this.state.notification;
    const options = { ...this.state.notification };

    if (!display) {
      return null;
    }

    setTimeout(() => {
      this.setState({
        notification: {}
      });
    }, options.delay || 1000)

    return (
      <Notification {...options} />
    );
  }

}
