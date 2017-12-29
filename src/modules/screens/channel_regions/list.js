import React, {Component} from 'react';
import { Button, Table, Card, CardBody } from 'reactstrap';
import fecha from 'fecha';
import { connect } from 'react-redux';

import { Confirm } from 'components/Confirm/';
import Paginator from 'components/Paginator/'
import Notificator from 'components/Notificator/'
import Loading from 'components/Loading/'
import Nodata from 'components/Nodata/'
import NewChannelRegion from './new'
import EditChannelRegion from './edit'
import DestroyChannel from './destroy_channel'
import Channels from './channels'
import { default as ChannelRegionToggleStatus } from './toggle_status'
import { default as ChannelUserResetPassword } from '../channel_users/reset_password'

import {
  fetchChannelRegionAll
} from 'reducers/channel_region';

@connect(state => ({
  channel_region: state.channel_region
}), {
  fetchChannelRegionAll
})
class ChannelRegion extends Component {
  constructor (props) {
    super(props);

    this.state = {
      networkError: false,
      isLoading: true
    }

  }

  componentDidMount() {
    this.notificator = this.refs.notificator;
    this.fetch();
  }

  async fetch(params = {}) {
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
      const res = await this.props.fetchChannelRegionAll(optimizes);
      this.setState({ isLoading: false });
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  handleEditChannelRegionClick(channel_region = {}) {
    channel_region.selectedOptions = _.map(channel_region.channel_region_maps, (map) => {
      return { id: map.channel_id, name: map.channel_name };
    });

    this.refs.EditChannelRegion.showModal({...channel_region});
  }

  renderNewChannelRegionModal() {
    return (
      <NewChannelRegion
        ref="NewChannelRegion"
        notificator={this.refs.notificator}
        success={(data) => {
          this.fetch({ page: 1 });
        }}
      />
    );
  }

  renderEditChannelRegionModal() {
    return (
      <EditChannelRegion
        ref="EditChannelRegion"
        notificator={this.refs.notificator}
        channel_region={{}}
        success={(data) => {
          this.fetch();
        }}
      />
    )
  }

  renderChannelUserResetPasswordModal() {
    return (
      <ChannelUserResetPassword
        ref="ChannelUserResetPassword"
        notificator={this.refs.notificator}
        channel_user={{}}
        success={(data) => {}}
      />
    )
  }

  renderNotificator() {
    return (
      <Notificator ref="notificator" />
    );
  }

  renderPaginator() {
    const { channel_regions } = this.props.channel_region;

    return (
      <Paginator handlePageChange={::this.handlePageChange} {...this.props} collection={channel_regions} />
    );
  }

  renderChannels() {
    return (
      <Channels
        ref='Channels'
        notificator={this.refs.notificator}
        callback={() => {
          this.fetch();
        }}
      />
    );
  }

  renderListOperate(item) {
    return (
      <th>
        <ChannelRegionToggleStatus
          channel_region={item}
          notificator={this.refs.notificator}
          success={(data) => {
            this.fetch();
          }}
        />
        <Button size="sm" className='btn-edit' color="primary" onClick={() => this.handleEditChannelRegionClick(item) }>编辑</Button>
      </th>
    )
  }

  renderChannelRegionTr(channel_region) {
    const channel_region_maps = channel_region.channel_region_maps;
    channel_region.channel_ids = _.map(channel_region_maps, 'channel_id');

    return (
      <tr key={ channel_region.id }>
        <th>{ channel_region.id }</th>
        <th>{ channel_region.name }</th>
        <th>
          {
            _.map(channel_region.channel_users, (channel_user) => {
              return (
                <p key={channel_user.id}>
                  {channel_user.name} {channel_user.phone}
                  <Button size="sm"
                    className='btn-delete pull-right'
                    onClick={() => this.refs.ChannelUserResetPassword.showModal(channel_user) }
                    color="primary"
                  >
                    修改密码
                  </Button>
                </p>
              )
            })
          }
        </th>
        <th>
          {
            _.map(channel_region_maps, (channel_region_map) => {
              const channel_user = channel_region_map.channel_users[0] || {};
              const {channel} = channel_region_map;

              return (
                <div className='region-item' key={channel_region_map.id}>
                  {
                    <span key={channel.id}>{channel.name} {channel_user.name} {channel_user.phone}<br/></span>
                  }
                  <DestroyChannel
                    channel_region_map={channel_region_map}
                    notificator={this.refs.notificator}
                    success={(data) => {
                      this.fetch();
                    }}
                  />
                </div>
              )
            })
          }
          <div className='region-item'>
            { channel_region_maps.length >= 2 && <Button color="link" block active onClick={() => this.refs.Channels.showModal(channel_region) }>显示更多</Button> }
          </div>
        </th>
        <th>{ fecha.format(new Date(channel_region.updated_at), 'YYYY-MM-DD HH:mm:ss') }</th>
        <th>{ fecha.format(new Date(channel_region.created_at), 'YYYY-MM-DD HH:mm:ss') }</th>
        { this.renderListOperate(channel_region) }
      </tr>
    );
  }

  renderChannelRegionTableTbody() {
    const { channel_regions: { isFetching, list, current_page } } = this.props.channel_region;
    const { isLoading, networkError }  = this.state;

    if (isLoading) {
      return <Loading isLoading={isLoading} type='tr' th={{colSpan: 7}} />
    } else if (networkError) {
      return <Nodata isNodata={networkError} info="网络错误..." type='tr' th={{colSpan: 7}}  />
    } else if (!list.length) {
      return <Nodata isNodata={!list.length} type='tr' th={{colSpan: 7}}  />
    }

    return _.map(list, (channel_region) => {
      return this.renderChannelRegionTr(channel_region);
    });
  }


  renderChannelRegionTable() {
    const { channel_regions: { isFetching, list, current_page } } = this.props.channel_region;
    const { isLoading, isNodata, networkError }  = this.state;

    return (
      <Table bordered size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>区域名称</th>
            <th>渠道管理员</th>
            <th>渠道</th>
            <th>修改时间</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          { this.renderChannelRegionTableTbody() }
        </tbody>
      </Table>
    );
  }

  handlePageChange(params = {}) {
    this.fetch(params);
  }

  render() {
    return (
      <div className='manage-setting'>
        <Card>
          <CardBody>
            <div className="pull-right">
              <Button color="primary" className='btn-add' onClick={() => this.refs.NewChannelRegion.showModal() }>新增区域</Button>
            </div>
            { this.renderChannelRegionTable() }
            { this.renderEditChannelRegionModal() }
            { this.renderNewChannelRegionModal() }
            { this.renderChannelUserResetPasswordModal() }
            { this.renderPaginator() }
            { this.renderNotificator() }
            { this.renderChannels() }
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default ChannelRegion;
