import React, {Component} from 'react';

class Footer extends Component {
  render() {
    const date = new Date();

    return (
      <footer className="app-footer">
        <span><a href="http://bi.99zmall.com">芝蚂城 BI</a> &copy; 2016-{date.getFullYear()} 爱上岗.</span>
        <span className="ml-auto">Powered by <a href="http://coreui.io">CoreUI</a></span>
      </footer>
    )
  }
}

export default Footer;
