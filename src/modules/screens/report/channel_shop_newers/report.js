// import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// import 'antd/dist/antd.css';
import React, { Component } from 'react'
import { DatePicker } from 'antd';

import { Button, Table, Card, CardBody, Input, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import fecha from 'fecha';
import qs from 'qs';

import Paginator from 'components/Paginator/';
import Loading from 'components/Loading/';
import Nodata from 'components/Nodata/';
import ChannelSelector from 'components/Selector/channel';
import Export from 'components/Export/';
import {
  fetchReport
} from 'reducers/report/channel_shop_newer';
import {
  fetchChannelShow
} from 'reducers/channel';

const { MonthPicker } = DatePicker;

@connect(state => ({
  report_channel_shop_newer: state.report_channel_shop_newer,
  channel: state.channel
}), {
  fetchReport,
  fetchChannelShow
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
      report_date: fecha.format(this.nowTime, 'YYYY-MM-DD'),
      channel_id: null,
      channel: null
    };

    this.handleTimeTypeChange = this.handleTimeTypeChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleTimeTypeChange = this.handleTimeTypeChange.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const nextLocation = nextProps.location;
    const currentLocation = this.props.location;

    if (nextLocation !== currentLocation) {
      const params = this.parseUrlParams(nextLocation);

      this.fetchFilters(params);
      this.fetch(params);
    }
  }

  parseUrlParams(obj) {
    const location = obj || this.props.location;
    const params = qs.parse(location.search, {
      ignoreQueryPrefix: true
    });

    if (params.report_date) {
      const date = new Date(params.report_date);

      if (params.time_type === 'day') params.day_value = fecha.format(date, 'YYYY-MM-DD');
      if (params.time_type === 'month') params.month_value = fecha.format(date, 'YYYY-MM');
    }

    return params;
  }

  updateUrlParams(params = {}) {
    const location = this.props.location;
    let urlParams = this.parseUrlParams();
    urlParams = _.assign(urlParams, params);

    _.forEach(urlParams, (value, key) => {
       urlParams[key] = urlParams[key] || null;
    });

    const filterStateParams = this.filterStateParams(urlParams);

    this.setState(filterStateParams, () => {
      const filterUrlParams = this.filterUrlParams(urlParams);
      const query = qs.stringify(filterUrlParams, {
        arrayFormat: 'brackets',
        addQueryPrefix: true
      });

      this.props.history.push(`${location.pathname}${query}`);
    });
  }

  componentDidMount() {
    const params = this.parseUrlParams();

    this.fetchFilters(params);
    this.fetch(params);
  }

  filterUrlParams(obj) {
    return _.pick(obj,
      [
        'page',
        'per_page',
        'time_type',
        'channel_id',
        'report_date',
      ]
    );
  }

  filterStateParams(obj) {
    return _.pick(obj,
      [
        'page',
        'per_page',
        'time_type',
        'channel_id',
        'report_date',
        'day_value',
        'month_value',
        'channel'
      ]
    );
  }

  fetchFilters(params) {
    this.fetchFilterChannel(params.channel_id);
  }

  async fetchFilterChannel(id) {
    if (!id) {
      this.setState({ channel: null });
      return;
    }

    const channel = this.state.channel || {};
    if (Number(id) === channel.id) return;

    try {
      const res = await this.props.fetchChannelShow({ id });
      this.setState({ channel: res.data });
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  async fetch(params = {}) {
    this.setState({ isLoading: true });
    this.setState(this.filterStateParams(params));

    const filterStateParams = this.filterStateParams(this.state);
    _.assign(filterStateParams, params);

    try {
      const optimizes = this.filterUrlParams(filterStateParams);
      const res = await this.props.fetchReport(optimizes);
      this.setState({ isLoading: false });
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  handlePageChange(params = {}) {
    this.updateUrlParams(params);
  }

  handleExport() {
    try {

      this.refs.export.showExportModal(() => {
        const filterStateParams = this.filterStateParams(this.state);
        const optimizes = this.filterUrlParams(filterStateParams);
        _.assign(optimizes, {
          action_type: 'export',
          page: 1
        });

        this.props.fetchReport(optimizes).then((res) => {
          this.refs.export.updateVariables(res.data);
        });
      });
    } catch(e) {

    }
  }

  handleTimeTypeChange(event) {
    const time_type = event.target.value;
    const day_value = fecha.format(this.nowTime, 'YYYY-MM-DD');
    const month_value = fecha.format(this.nowTime, 'YYYY-MM');

    this.updateUrlParams({
      page: 1,
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
            this.updateUrlParams({ page: 1, report_date: dateString, time_type: 'day', day_value: dateString });
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
            this.updateUrlParams({ page: 1, report_date: `${dateString}-01`, time_type: 'month', month_value: dateString });
          }}
          value={moment(month_value, 'YYYY-MM')}
          placeholder="选择月份"
          allowClear={false}
        />
      );
    }
  }

  renderFilters() {
    const { time_type, channel } = this.state;

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
              value={channel}
              async={true}
              onChange={(value) => {
                const channel = value || {};
                this.updateUrlParams({ page: 1, channel_id: channel.id, channel: value });
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
    );
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
    const { isLoading }  = this.state;

    return (
      !isLoading && <Paginator handlePageChange={this.handlePageChange} collection={report} />
    );
  }

  renderExport() {
    const { report: { isFetching, list, current_page } } = this.props.report_channel_shop_newer;

    if (!list.length) return null;

    return (
      <div className="padl10 lineh30 pull-right marr20 martm25">
        <Export ref="export" actionName="渠道新增店主" />
        <a href="javascript:;" onClick={this.handleExport}>导出</a>
      </div>
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
            { this.renderExport() }
          </CardBody>
        </Card>
      </div>
    );
  }

}

export default Report;
