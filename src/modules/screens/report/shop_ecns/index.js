import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import React, { Component } from 'react'
import { DatePicker } from 'antd';

import { Button, Table, Card, CardBody, Input, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import fecha from 'fecha';
import qs from 'qs';

import Paginator from 'components/Paginator/';
import Loading from 'components/Loading/';
import Nodata from 'components/Nodata/';
import Export from 'components/Export/';
import {
  fetchIndex
} from 'reducers/report/shop_ecn';

const { RangePicker } = DatePicker;

@connect(state => ({
  listData: state.report_shop_ecn,
}), { fetchIndex })
class Index extends Component {
  constructor(props) {
    super(props);

    this.nowTime = new Date();
    this.state = {
      page: 1,
      shopkeeper: {
        user_name: '',
        user_phone: '',
      },
      created_ats: [],
      ecn_count_value: ''
    };

    this.handleEcnCountChange = this.handleEcnCountChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleShopkeeperUserNameChange = this.handleShopkeeperUserNameChange.bind(this);
    this.handleShopkeeperUserPhoneChange = this.handleShopkeeperUserPhoneChange.bind(this);
    this.handleCreatedAtChange = this.handleCreatedAtChange.bind(this);
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

  componentDidUpdate() {
    const reportDom = document.getElementById('report');

    reportDom.classList.remove('table-responsive');
    setTimeout(() => {
      reportDom.classList.add('table-responsive');
      reportDom.scrollLeft = 0;
    }, 0);
  }

  parseUrlParams(obj) {
    const location = obj || this.props.location;
    const params = qs.parse(location.search, {
      ignoreQueryPrefix: true
    });

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
        'ecn_count',
        'shopkeeper',
        'created_at'
      ]
    );
  }

  filterStateParams(obj) {
    return _.pick(obj,
      [
        'page',
        'per_page',
        'ecn_count',
        'ecn_count_value',
        'shopkeeper',
        'created_at',
        'created_ats'
      ]
    );
  }

  fetchFilters(params) {
    if (params.created_at) {
      const created_ats = _.map(params.created_at.split('..'), (at) => {
        return moment(at, 'YYYY-MM-DD');
      });

      this.setState({ created_ats });
    }

    if (params.ecn_count) {
      const values = params.ecn_count.split('..');

      this.setState({ ecn_count_value: _.last(values) });
    }
  }

  async fetch(params = {}) {
    this.setState({ isLoading: true });
    this.setState(this.filterStateParams(params));

    const filterStateParams = this.filterStateParams(this.state);
    _.assign(filterStateParams, params);

    try {
      const optimizes = this.filterUrlParams(filterStateParams);
      const res = await this.props.fetchIndex(optimizes);
      this.setState({ isLoading: false });
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  handlePageChange(params = {}) {
    this.updateUrlParams(params);
  }

  handleEcnCountChange(event) {
    const ecn_count_value = event.target.value;
    const ecn_count = ecn_count_value !== '-1' ? `0..${ecn_count_value}` : '';

    this.updateUrlParams({
      page: 1,
      ecn_count: ecn_count,
      ecn_count_value: ecn_count_value
    });
  }

  handleShopkeeperUserNameChange(event) {
    const { shopkeeper } = this.state;
    shopkeeper.user_name = event.target.value;

    this.updateUrlParams({
      page: 1,
      shopkeeper
    });
  }

  handleShopkeeperUserPhoneChange(event) {
    const { shopkeeper } = this.state;
    shopkeeper.user_phone = event.target.value;

    this.updateUrlParams({
      page: 1,
      shopkeeper
    });
  }

  handleCreatedAtChange(dates, dateStrings) {
    this.updateUrlParams({
      page: 1,
      created_at: _.filter(dateStrings, (e) => {
        return e;
      }).join('..'),
      created_ats: dates
    });
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

        this.props.fetchIndex(optimizes).then((res) => {
          this.refs.export.updateVariables(res.data);
        });
      });
    } catch(e) {

    }
  }

  renderFilters() {
    const { ecn_count_value, created_ats, shopkeeper: {user_name, user_phone}} = this.state;

    return (
      <div>
        <Row className='sort'>
          <Col xs="1" className="text align-self-center">时间范围:</Col>
          <Col xs="2">
            <Input type="select" name="ecn_count" value={ecn_count_value} onChange={this.handleEcnCountChange}>
              <option value="-1">全部</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="150">150</option>
            </Input>
          </Col>
        </Row>
        <Row className='sort'>
          <Col xs="1" className="text align-self-center">店主姓名:</Col>
          <Col xs="2">
            <Input name="shopkeeper_user_name" value={user_name} onChange={this.handleShopkeeperUserNameChange} />
          </Col>
        </Row>
        <Row className='sort'>
          <Col xs="1" className="text align-self-center">手机号:</Col>
          <Col xs="2">
            <Input name="shopkeeper_user_phone" value={user_phone} onChange={this.handleShopkeeperUserPhoneChange} />
          </Col>
        </Row>
        <Row className='sort'>
          <Col xs="1" className="text align-self-center">时间范围:</Col>
          <Col xs="auto">
            <RangePicker
              format="YYYY-MM-DD"
              onChange={this.handleCreatedAtChange}
              placeholder={['开始时间', '结束时间']}
              value={created_ats}
            />
          </Col>
        </Row>
      </div>
    );
  }

  renderReportTr(item) {
    return (
      <tr align="center" key={ item.id }>
        <td>{ item.id }</td>
        <th>{ item.shopkeeper_name }</th>
        <th>{ item.shop_name }</th>
        <th>{ item.shopkeeper_phone }</th>
        <th>{ item.ecn_count }</th>
        <th>{ item.ancestry_rate }</th>
        <th>{ item.ecn_grade_platinum_count }</th>
        <th>{ item.ecn_grade_gold_count }</th>
        <th>{ item.children_grade_platinum_count }</th>
        <th>{ item.children_grade_gold_count }</th>
        <th>{ item.indirectly_descendant_grade_platinum_count }</th>
        <th>{ item.indirectly_descendant_grade_gold_count }</th>
        <th>{ item.channel_name }</th>
      </tr>
    );
  }

  renderReportTableTbody() {
    const { shop_ecns: { isFetching, list, current_page } } = this.props.listData;
    const { isLoading, networkError }  = this.state;

    if (isLoading) {
      return <Loading isLoading={isLoading} type='tr' th={{colSpan: 13}} />
    } else if (networkError) {
      return <Nodata isNodata={networkError} info="网络错误..." type='tr' th={{colSpan: 13}} />
    } else if (!list.length) {
      return <Nodata isNodata={!list.length} type='tr' th={{colSpan: 13}} />
    }

    return _.map(list, (item) => {
      return this.renderReportTr(item);
    });
  }

  renderReportTable() {
    return (
      <div className='table-responsive' id='report'>
        <Table bordered style={{"tableLayout": 'fixed'}}>
          <thead>
            <tr align="center">
              <th headers="idrefs" width="60">序号</th>
              <th width="100">店主名称</th>
              <th width="100">店铺名称</th>
              <th width="120">手机号</th>
              <th width="100">ECN总数</th>
              <th width="120">上级总数占比</th>
              <th width="120">ECN-白金</th>
              <th width="120">ECN-黄金</th>
              <th width="120">直接-白金总数</th>
              <th width="120">直接-黄金总数</th>
              <th width="120">间接-白金总数</th>
              <th width="120">间接-黄金总数</th>
              <th width="100">所属渠道</th>
            </tr>
          </thead>
          <tbody>
            { this.renderReportTableTbody()}
          </tbody>
        </Table>
      </div>
    );
  }

  renderPaginator() {
    const { shop_ecns } = this.props.listData;
    const { isLoading }  = this.state;

    return (
      !isLoading && <Paginator handlePageChange={this.handlePageChange} collection={shop_ecns} />
    );
  }

  renderExport() {
    const { shop_ecns: { isFetching, list, current_page } } = this.props.listData;

    if (!list.length) return null;

    return (
      <div className="padl10 lineh30 pull-right marr20 martm25">
        <Export ref="export" actionName="店主ECN" />
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

export default Index;
