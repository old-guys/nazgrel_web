import zhCN from 'antd/lib/locale-provider/zh_CN';
import React, { Component } from 'react'
import moment from 'moment';
import { DatePicker } from 'antd';
import { Button, Table, Card, CardBody, Input, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import fecha from 'fecha';

import Paginator from '../../../../components/Paginator/';
import Loading from '../../../../components/Loading/';
import Nodata from '../../../../components/Nodata/';
import ChannelSelector from '../../../../components/Selector/channel';
import {
  fetchReport
} from '../../../reducers/report/channel_shop_newer';

moment.locale('zh-cn');
const { MonthPicker } = DatePicker;

@connect(state => ({
  report_channel_shop_newer: state.report_channel_shop_newer
}), {
  fetchReport
})
class Report extends Component {
  constructor(props) {
    super(props);

    this.nowTime = new Date();
    this.state = {
      page: 1,
      time_type: 'day',
      day_value: fecha.format(this.nowTime, 'YYYY-MM-DD'),
      month_value: fecha.format(this.nowTime, 'YYYY-MM'),
      report_date: null,
      channel_id: null
    };

    this.handleTimeTypeChange = this.handleTimeTypeChange.bind(this);
    this.handleD = this.handleTimeTypeChange.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  getReportDate(time_type) {
    const type = time_type || this.state.time_type;
    const { day_value, month_value } = this.state;

    if (time_type === time_type) return day_value;
    return `${month_value}-01`;
  }

  async fetch(params = {}) {
    this.setState({ isLoading: true });

    const page = params.page || this.state.page || 1;
    const per_page = params.per_page || this.state.per_page;
    const time_type = params.time_type || this.state.time_type;
    const channel_id = params.channel_id || this.state.channel_id;
    const report_date = params.report_date || this.getReportDate(time_type);
    const day_value = params.day_value || this.state.day_value;
    const month_value = params.month_value || this.state.month_value;
    const optimizes = { page, per_page, time_type, channel_id, report_date };

    this.setState({
      page,
      per_page,
      time_type,
      channel_id,
      report_date,
      day_value,
      month_value
    });

    try {
      const res = await this.props.fetchReport(optimizes);
      this.setState({ isLoading: false });
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  handlePageChange(params = {}) {
    this.fetch(params);
  }

  handleTimeTypeChange(event) {
    const time_type = event.target.value;
    const day_value = fecha.format(this.nowTime, 'YYYY-MM-DD');
    const month_value = fecha.format(this.nowTime, 'YYYY-MM');

    this.fetch({
      time_type,
      day_value,
      month_value,
      report_date: day_value
    });
  }

  renderFilterDatePicker() {
    const { time_type, day_value, month_value } = this.state;

    if (time_type === 'day') {
      return (
        <DatePicker
          onChange={(date, dateString) => {
            this.fetch({ report_date: dateString, time_type: 'day', day_value: dateString });
          }}
          value={moment(day_value, 'YYYY-MM-DD')}
          placeholder="选择日期"
          showToday={false}
          allowClear={false}
        />
      );
    } else {
      return (
        <MonthPicker
          onChange={(date, dateString) => {
            this.fetch({ report_date: `${dateString}-01`, time_type: 'month', month_value: dateString });
          }}
          value={moment(month_value, 'YYYY-MM')}
          placeholder="选择月份"
          allowClear={false}
        />
      );
    }
  }

  renderFilters() {
    const { time_type } = this.state;

    return (
      <div>
        <Row className='sort'>
          <Col className='pr0-center' xs="auto">时间范围:</Col>
          <Col xs="1">
            <Input type="select" name="time_type" value={time_type} onChange={this.handleTimeTypeChange}>
              <option value="day">天</option>
              <option value="month">月</option>
            </Input>
          </Col>
          <Col className='pr0-center mart2' xs="auto">
            { this.renderFilterDatePicker() }
          </Col>
        </Row>
        <Row className='sort'>
          <Col className='pr0-center' xs="auto">所属渠道:</Col>
          <Col xs="2">
            <ChannelSelector
              multi={false}
              clearable={false}
              searchable={false}
              onChange={(value) => {
                const channel = value || {};
                this.fetch({ channel_id: channel.id || ' ' });
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }

  renderReportTableCountTr() {
    let { report: { summary } } = this.props.report_channel_shop_newer;
    if (_.isUndefined(summary)) summary = {};

    return (
      <tr align="center">
        <th headers="idrefs">合计</th>
        <th></th>
        <th></th>
        <th></th>
        <th>{ summary.stage_1_grade_platinum }</th>
        <th>{ summary.stage_1_grade_gold }</th>
        <th>{ summary.stage_2_grade_platinum }</th>
        <th>{ summary.stage_2_grade_gold }</th>
        <th>{ summary.stage_3_grade_platinum }</th>
        <th>{ summary.stage_3_grade_gold }</th>
        <th>{ summary.month_grade_platinum }</th>
        <th>{ summary.month_grade_gold }</th>
        <th>{ summary.year_grade_platinum }</th>
        <th>{ summary.year_grade_gold }</th>
      </tr>
    )
  }

  renderReportTr(item) {
    const channel = item.channel || {};

    return (
      <tr align="center" key={ item.index }>
        <th>{ item.index }</th>
        <th>{ channel.channel_user_name }</th>
        <th>{ channel.name }</th>
        <th>{ channel.city }</th>
        <th>{ item.stage_1_grade_platinum }</th>
        <th>{ item.stage_1_grade_gold }</th>
        <th>{ item.stage_2_grade_platinum }</th>
        <th>{ item.stage_2_grade_gold }</th>
        <th>{ item.stage_3_grade_platinum }</th>
        <th>{ item.stage_3_grade_gold }</th>
        <th>{ item.month_grade_platinum }</th>
        <th>{ item.month_grade_gold }</th>
        <th>{ item.year_grade_platinum }</th>
        <th>{ item.year_grade_gold }</th>
      </tr>
    );
  }

  renderReportTableTbody() {
    const { report: { isFetching, list, current_page } } = this.props.report_channel_shop_newer;
    const { isLoading, networkError }  = this.state;

    if (isLoading) {
      return <Loading isLoading={isLoading} type='tr' th={{colSpan: 14}} />
    } else if (networkError) {
      return <Nodata isNodata={networkError} info="网络错误..." type='tr' th={{colSpan: 14}}  />
    } else if (!list.length) {
      return <Nodata isNodata={!list.length} type='tr' th={{colSpan: 14}}  />
    }

    return _.map(list, (item) => {
      return this.renderReportTr(item);
    });
  }

  renderReportTable() {
    return (
      <Table bordered>
        <thead>
          { this.renderReportTableCountTr() }
          <tr align="center">
            <th headers="idrefs">序号</th>
            <th>责任人</th>
            <th>所属渠道</th>
            <th>所在城市</th>
            <th colSpan="2">00：00至09：00</th>
            <th colSpan="2">09：00至18：00</th>
            <th colSpan="2">18：00至24：00</th>
            <th colSpan="2">本月累计</th>
            <th colSpan="2">本年累计</th>
          </tr>
          <tr align="center">
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th className='shop_type' colSpan="2">
              <span>白</span>
              <span>黄</span>
            </th>
            <th className='shop_type' colSpan="2">
              <span>白</span>
              <span>黄</span>
            </th>
            <th className='shop_type' colSpan="2">
              <span>白</span>
              <span>黄</span>
            </th>
            <th className='shop_type' colSpan="2">
              <span>白</span>
              <span>黄</span>
            </th>
            <th className='shop_type' colSpan="2">
              <span>白</span>
              <span>黄</span>
            </th>
          </tr>
        </thead>
        <tbody>
          { this.renderReportTableTbody()}
        </tbody>
      </Table>
    );
  }

  renderPaginator() {
    const { report } = this.props.report_channel_shop_newer;

    return (
      <Paginator handlePageChange={::this.handlePageChange} {...this.props} collection={report} />
    );
  }

  render() {
    return (
      <div className='newly-shop'>
        <Card>
          <CardBody>
            { this.renderFilters() }
            { this.renderReportTable() }
            { this.renderPaginator() }
          </CardBody>
        </Card>
      </div>
    );
  }

}

export default Report;
