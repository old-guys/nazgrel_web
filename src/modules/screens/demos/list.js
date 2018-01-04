import React, {Component} from 'react';
import { Card, CardBody, Button, Table } from 'reactstrap';
import fecha from 'fecha';
import { connect } from 'react-redux';
import qs from 'qs';

import { Confirm } from 'components/Confirm/';
import Paginator from 'components/Paginator/';
import Notificator from 'components/Notificator/';
import Loading from 'components/Loading/';
import Nodata from 'components/Nodata/';
// import NewDemo from './new';
// import EditDemo from './edit';
// import DestroyDemo from './destroy';
import { NewDemo, EditDemo, DestroyDemo } from './';

import { fetchDemoAll } from 'reducers/demo';

@connect(state => ({
  demos: state.demo
}), {
  fetchDemoAll
})
class Demo extends Component {
  constructor (props) {
    super(props)

    this.state = {};

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const nextLocation = nextProps.location;
    const currentLocation = this.props.location;

    if (nextLocation !== currentLocation) {
      const params = this.parseUrlParams(nextLocation);
      this.fetch(params);
    }
  }

  parseUrlParams(obj) {
    const location = obj || this.props.location;

    return qs.parse(location.search, {
      ignoreQueryPrefix: true
    });
  }

  updateUrlParams(params = {}) {
    const location = this.props.location;
    const urlParams = _.assign(this.parseUrlParams(), params);
    const query = qs.stringify(urlParams, {
      arrayFormat: 'brackets',
      addQueryPrefix: true
    });

    this.props.history.push(`${location.pathname}${query}`);
  }

  componentDidMount() {
    const params = this.parseUrlParams();

    this.fetch(params);
  }

  handlePageChange(params = {}) {
    this.updateUrlParams(params);
  }

  async fetch(params = {}) {
    this.setState({ isLoading: true });

    try {
      const optimizes = _.pick(params, ['page', 'per_page', 'filters', 'query']);
      const res = await this.props.fetchDemoAll(optimizes);
      this.setState({ isLoading: false });
    } catch(e) {
      console.error(`failure to load enum field, ${e}`);
      this.setState({ networkError: true });
    }
  }

  renderNewBtn() {
    return (
      <div className="pull-right">
        <Button color="primary" onClick={() => {
          this.refs.NewDemo.refs.NewDemo.showModal();
          // this.refs.NewDemo.showModal();
        } }>新增DEMO</Button>
      </div>
    );
  }

  renderNewDemoModal() {
    return (
      <NewDemo
        ref="NewDemo"
        notificator={this.refs.notificator}
        success={(data) => {
          this.fetch();
        }}
      />
    );
  }

  renderEditDemoModal() {
    return (
      <EditDemo
        ref="EditDemo"
        demo={{}}
        notificator={this.refs.notificator}
        success={(data) => {
          this.fetch();
        }}
      />
    );
  }

  renderNotificator() {
    return <Notificator ref="notificator" />;
  }

  renderPaginator() {
    const { demos } = this.props.demos;
    const { isLoading }  = this.state;

    return (
      !isLoading && <Paginator handlePageChange={this.handlePageChange} collection={ demos } />
    );
  }

  renderListOperate(demo) {
    return (
      <th>
        <DestroyDemo
          demo={demo}
          notificator={this.refs.notificator}
          success={(data) => {
            this.fetch();
          }}
        />
        <Button size="sm" color="primary" onClick={() => {
          this.refs.EditDemo.refs.EditDemo.showModal(demo);
          // this.refs.EditDemo.showModal(demo);
        } }>编辑</Button>
      </th>
    );
  }

  renderDemoTr(demo) {
    return (
      <tr key={ demo.id }>
        <th>{ demo.id }</th>
        <th>{ demo.name }</th>
        <th>{ fecha.format(new Date(demo.updated_at), 'YYYY-MM-DD HH:mm:ss') }</th>
        <th>{ fecha.format(new Date(demo.created_at), 'YYYY-MM-DD HH:mm:ss') }</th>
        { this.renderListOperate(demo) }
      </tr>
    );
  }

  renderDemoTableTbody() {
    const { demos: { isFetching, list, current_page } } = this.props.demos;
    const { networkError, isLoading } = this.state;

    if (isLoading) {
      return <Loading isLoading={isLoading} type='tr' th={{colSpan: 5}} />
    } else if (networkError) {
      return <Nodata isNodata={networkError} info="网络错误..." type='tr' th={{colSpan: 5}}  />
    } else if (!list.length) {
      return <Nodata isNodata={!list.length} type='tr' th={{colSpan: 5}}  />
    }

    return _.map(list, (demo) => {
      return this.renderDemoTr(demo);
    });
  }

  renderDemoTable() {
    return (
      <Table bordered size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>修改时间</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          { this.renderDemoTableTbody() }
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <div className='manage-setting'>
        <Card>
          <CardBody>
            { this.renderNewBtn() }
            { this.renderDemoTable() }
            { this.renderNewDemoModal() }
            { this.renderEditDemoModal() }
            { this.renderPaginator() }
            { this.renderNotificator() }
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default Demo;
