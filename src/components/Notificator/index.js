import React from 'react';
import ReactDOM from 'react-dom';
import { Alert, AlertList } from "react-bs-notifier";

export default class Notificator extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      alerts: [],
      position: 'top-right',
      timeout: 5000
    }
  }

  notice(opts = {}) {
    let defaultOpts = {
      type: 'info',
      title: '提示',
    };

    this.addNotify(_.merge(defaultOpts, opts));
  }

  success(opts = {}) {
    let defaultOpts = {
      type: 'success',
      title: '提示',
    };

    this.addNotify(_.merge(defaultOpts, opts));
  }

  error(opts = {}) {
    let defaultOpts = {
      type: 'danger',
      title: '提示',
    };

    this.addNotify(_.merge(defaultOpts, opts));
  }

  info(opts = {}) {
    let defaultOpts = {
      type: 'info',
      title: '提示',
    };

    this.addNotify(_.merge(defaultOpts, opts));
  }

  addNotify(opts = {}) {
    let { alerts } = this.state;
    alerts.push(
      {
        ...opts,
        id: alerts.length + 1,
        headline: (opts.title || opts.headline),
        message: (opts.message || opts.text)
      }
    )

    this.setState({
      alerts: alerts
    });
  }

  onAlertDismissed(alert) {
    const alerts = this.state.alerts;

    // find the index of the alert that was dismissed
    const idx = alerts.indexOf(alert);

    if (idx >= 0) {
      this.setState({
        // remove the alert from the array
        alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
      });
    }
  }

  render() {
    let { alerts, timeout, position } = this.state;

    return (
      <AlertList
        alerts={alerts}

        position={position}
        timeout={this.state.timeout}
        onDismiss={this.onAlertDismissed.bind(this)}
      />
    );
  }

}
