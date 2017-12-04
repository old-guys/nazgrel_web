import React from 'react';
import ReactDOM from 'react-dom';

export default class Loading extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      type: 'default'
    }
  }

  renderTr() {
    const { tr, th }  = this.props;

    return (
      <tr {...tr}>
        <th {...th}>
          <div class='loading-spinner text-center padt60 padb60'>
            <i class='fa fa-spinner fa-spin fz14'></i>正在加载
          </div>
        </th>
      </tr>
    );
  }

  renderDefault() {
    return (
      <div class='loading-spinner text-center padt60 padb60'>
        <i class='fa fa-spinner fa-spin fz14'></i>正在加载
      </div>
    );
  }

  render() {
    const { type, isLoading } = this.props;

    if (!isLoading) return null;

    switch (type) {
      case 'tr':
        return this.renderTr();
      default:
        return this.renderDefault();
    }
  }

}
