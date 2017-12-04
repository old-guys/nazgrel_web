import React from 'react';
import ReactDOM from 'react-dom';

export default class Nodata extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      type: 'default',
    }
  }

  renderTr() {
    const { tr, th, info }  = this.props;


    return (
      <tr {...tr}>
        <th {...th}>
          <div class='no-info text-center padt60 padb60'>
            <i class='fa fa-smile-o text-muted'></i>
            { info || '暂无相关数据...' }
          </div>
        </th>
      </tr>
    );
  }

  renderDefault() {
    const { info }  = this.props;

    return (
      <div class='no-info text-center padt60 padb60'>
        <i class='fa fa-smile-o text-muted'></i>
        { info || '暂无相关数据...' }
      </div>
    );
  }

  render() {
    const { type, isNodata } = this.props;

    if (!isNodata) return null;

    switch (type) {
      case 'tr':
        return this.renderTr();
      default:
        return this.renderDefault();
    }
  }

}
