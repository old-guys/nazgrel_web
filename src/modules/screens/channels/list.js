import React, {Component} from 'react';
import { Card, CardBody, Button, Table } from 'reactstrap';
import fecha from 'fecha';
import { connect } from 'react-redux';

import { Confirm } from 'components/Confirm/';
import Paginator from 'components/Paginator/'
import Notificator from 'components/Notificator/'
import Loading from 'components/Loading/'
import Nodata from 'components/Nodata/'
import NewChannel from './new';
import EditChannel from './edit';
import { default as ChannelToggleStatus } from './toggle_status';

import { fetchChannelAll } from 'reducers/channel';

@connect(state => ({
  channels: state.channel,
  shopkeeper: state.shopkeeper,
  constant_setting: state.constant_setting
}), {
  fetchChannelAll
})
class Channel extends Component {
  constructor (props) {
    super(props)

    this.state = {

    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(params = {}) {
    this.fetchChannel(params);
  }

  componentDidMount() {
    this.fetchChannel();
  }

  async fetchChannel(params = {}) {
    this.setState({ isLoading: true });

    const page = params.page || this.state.page || 1;
    const per_page = params.per_page || this.state.per_page;
    const filters = params.filters || this.state.filters;
    const json_key = params.json_key || this.state.json_key;
    let optimizes = {
      page,
      per_page,
      filters,
      json_key,
    };

    this.setState({
      page: optimizes.page,
      per_page: optimizes.per_page,
      query: params.query,
      filters: optimizes.filters,
      json_key: optimizes.json_key,
    });
    delete optimizes.query;

    try {
      const res = await this.props.fetchChannelAll(optimizes);
      this.setState({
        isLoading: false,
      });
    } catch(e) {
      console.error(`failure to load enum field, ${e}`);
      this.setState({ networkError: true });
    }
  }

  renderNav() {
    return (
      <div className="pull-right">
        <Button color="primary" onClick={() => this.refs.NewChannel.showModal() }>新增渠道</Button>
      </div>
    );
  }

  renderNewChannelModal() {
    return (
      <NewChannel
        ref="NewChannel"
        notificator={this.refs.notificator}
        success={(data) => {
          this.fetchChannel();
        }}
      />
    );
  }

  renderEditChannelModal() {
    return (
      <EditChannel
        ref="EditChannel"
        notificator={this.refs.notificator}
        success={(data) => {
          this.fetchChannel();
        }}
      />
    );
  }

  renderNotificator() {
    return <Notificator ref="notificator" />;
  }

  renderPaginator() {
    const { channels } = this.props.channels;
    const { isLoading }  = this.state;

    return (
      !isLoading &&  <Paginator handlePageChange={this.handlePageChange} collection={ channels } />
    );
  }

  renderListOperate(item) {
    return (
      <th>
        <ChannelToggleStatus
          channel={item}
          notificator={this.refs.notificator}
          success={(data) => {
            this.fetchChannel();
          }}
        />
        <Button size="sm" color="primary" onClick={() => this.refs.EditChannel.showModal(item) }>编辑</Button>
      </th>
    );
  }

  renderChannelTr(channel) {
    return (
      <tr key={ channel.id }>
        <th>{ channel.id }</th>
        <th>{ channel.name }</th>
        <th>{ channel.city }</th>
        <th>{ channel.shopkeeper_name }</th>
        <th>{ channel.shopkeeper_phone }</th>
        <th>{ channel.category_text }</th>
        <th>{ channel.source_text }</th>
        <th>{ fecha.format(new Date(channel.updated_at), 'YYYY-MM-DD HH:mm:ss') }</th>
        <th>{ fecha.format(new Date(channel.created_at), 'YYYY-MM-DD HH:mm:ss') }</th>
        { this.renderListOperate(channel) }
      </tr>
    );
  }

  renderChannelTableTbody() {
    const { channels: { isFetching, list, current_page } } = this.props.channels;
    const { networkError, isLoading } = this.state;

    if (isLoading) {
      return <Loading isLoading={isLoading} type='tr' th={{colSpan: 10}} />
    } else if (networkError) {
      return <Nodata isNodata={networkError} info="网络错误..." type='tr' th={{colSpan: 10}}  />
    } else if (!list.length) {
      return <Nodata isNodata={!list.length} type='tr' th={{colSpan: 10}}  />
    }

    return _.map(list, (channel) => {
      return this.renderChannelTr(channel);
    });
  }

  renderChannelTable() {
    return (
      <Table bordered size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>渠道名称</th>
            <th>城市</th>
            <th>店主姓名</th>
            <th>店主手机号</th>
            <th>渠道类型</th>
            <th>渠道来源</th>
            <th>修改时间</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          { this.renderChannelTableTbody() }
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <div className='manage-setting'>
        <Card>
          <CardBody>
            { this.renderNav() }
            { this.renderChannelTable() }
            { this.renderNewChannelModal() }
            { this.renderEditChannelModal() }
            { this.renderPaginator() }
            { this.renderNotificator() }
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default Channel;
