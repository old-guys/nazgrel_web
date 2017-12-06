import React, {Component} from 'react';
import {
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Progress,
  InputGroup, InputGroupAddon, Input, Row, Col, Container, Alert, Card, CardBody,
  FormGroup, Label, CardHeader, CardFooter
} from 'reactstrap';
import { AvForm, AvGroup, AvField, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import fecha from 'fecha';
import { connect } from 'react-redux';

import { Confirm } from '../../components/Confirm/';
import Paginator from './../../components/Paginator/'
import Notificator from './../../components/Notificator/'
import Loading from './../../components/Loading/'
import Nodata from './../../components/Nodata/'

import {
  fetchChannelRegionAll,
  createChannelRegion,
  updateChannelRegion,
  deleteChannelRegionChannel,
} from '../reducers/channel_region';

import { updateChannelUser } from '../reducers/channel_user';
import { fetchChannelAll as channelAll } from '../reducers/channel';

@connect(state => ({
  channel_region: state.channel_region,
  channel: state.channel
}), {
  fetchChannelRegionAll,
  createChannelRegion,
  updateChannelRegion,
  updateChannelUser,
  channelAll,
  deleteChannelRegionChannel
})
class ChannelRegion extends Component {
  constructor (props) {
    super(props);

    this.state = {
      networkError: false,
      isLoading: true,

      isShowChannelRegion: false,
      channel_region: {
        id: null,
        name: "",
        channel_ids: [],
        channel_user: {
          name: "",
          phone: "",
          password: "",
          confirm_password: ""
        }
      },
      copy_channel_region: {
        id: null,
        name: "",
        channel_ids: [],
        channel_user: {
          name: "",
          phone: "",
          password: "",
          confirm_password: ""
        }
      },

      isShowChannelRegionChannelUser: false,
      channel_region_channel_user: {}
    };

    this.handleSaveChannelRegionSubmit = this.handleSaveChannelRegionSubmit.bind(this);
    this.handleChannelRegionChannelUserSubmit = this.handleChannelRegionChannelUserSubmit.bind(this);
  }

  componentDidMount() {
    this.notificator = this.refs.notificator;
    this.fetch();
    this.fetchChannelAll();
  }

  async fetch(params = {}) {
    this.setState({ isLoading: true });

    const page = params.page || 1;
    const filters = params.filters || this.state.filters;
    const json_key = params.json_key || this.state.json_key;
    let optimizes = {
      page,
      filters,
      json_key,
    };

    this.setState({
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

  async fetchChannelAll(params = {}) {
    try {
      const res = await this.props.channelAll({});
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  async handleDeleteChannelRegionMap(channel_region, channel_region_map) {
    try {
      const res = await this.props.deleteChannelRegionChannel({ channel_region_map });

      if (Number(res.code) === 0) {
        this.notificator.success({ text: '删除渠道成功' });
        this.fetch();
      } else {
        this.notificator.error({ text: '删除渠道失败' });
      }
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  handleAddChannelRegionClick(channel_region = {}) {
    this.setState({
      isShowChannelRegion: true,
      channel_region: { ...this.state.copy_channel_region }
    });
  }

  handleEditChannelRegionClick(channel_region = {}) {
    this.setState({
      isShowChannelRegion: true,
      channel_region: channel_region
    });
  }

  hideChannelRegionModal() {
    this.setState({
      isShowChannelRegion: false,
      channel_region: {...this.state.channel_region},
      copy_channel_region: {
        id: null,
        name: "",
        channel_ids: [],
        channel_user: {
          name: "",
          phone: "",
          password: "",
          confirm_password: ""
        }
      }
    });
  }

  async saveChannelRegion() {
    let { channel_region } = this.state;
    const isNew = !_.isNumber(channel_region.id);
    const fun = isNew ? this.props.createChannelRegion : this.props.updateChannelRegion
    const opts = isNew ? channel_region : _.pick(channel_region, ['id', 'name', 'channel_ids']);
    console.log(channel_region)

    try {
      const res = await fun({ channel_region: opts });

      if (Number(res.code) === 0) {
        this.fetch();

        this.notificator.success({ text: '保存区域成功' });
        this.setState({
          isShowChannelRegion: false,
          channel_region: {...this.state.copy_channel_region}
        });
      } else {
        this.notificator.error({ text: '保存区域失败' });
      }
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  handleSaveChannelRegionSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.saveChannelRegion();
  }

  renderChannelRegionUserField() {
    const { isShowChannelRegion, channel_region, channel_region: { channel_user } } = this.state;
    const isNew = ! _.isNumber(channel_region.id);
    const { channels: { isFetching, list, current_page } } = this.props.channel;

    if (! isNew) {
      return null;
    }

    return (
      <fieldset>
        <AvField name="channel_user[name]"
          value={channel_user.name}
          label="主管名称" type="text"
          placeholder="输入主管名称"
          grid={{md: 9}}
          onChange={(e) => {
            channel_region.channel_user.name = e.target.value;

            this.setState({
              channel_region: channel_region
            })
          }}
          required
          validate={{pattern: { value: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[A-Za-z0-9])*$/ }}}
          errorMessage={{required: '输入主管名称', pattern: '区域名称只支持中文、英文、数字'}}
          />
        <AvField name="channel_user[phone]"
          value={channel_user.phone}
          label="主管手机号" type="phone"
          placeholder="输入主管手机号，将作为登录账号"
          grid={{md: 9}}
          onChange={(e) => {
            channel_region.channel_user.phone = e.target.value;

            this.setState({
              channel_region: channel_region
            })
          }}
          required
          errorMessage={{required: '输入主管手机号', phone: '手机号格式不正确'}}
          />
        <AvField name="channel_user[password]"
          value={channel_user.password}
          label="主管密码" type="password"
          placeholder="输入主管密码，将作为登录账号的密码"
          grid={{md: 9}}
          onChange={(e) => {
            channel_region.channel_user.password = e.target.value;

            this.setState({
              channel_region: channel_region
            })
          }}
          required
          minLength="6"
          errorMessage={{required: '输入主管密码', minLength: '密码不能少于6位'}}
          />
      </fieldset>
    )
  }

  renderChannelRegionModal() {
    const { isShowChannelRegion, channel_region } = this.state;
    const isNew = ! _.isNumber(channel_region.id);
    const channel_user = channel_region.channel_user || {};
    const { channels: { isFetching, list, current_page } } = this.props.channel;

    return (
      <Modal isOpen={isShowChannelRegion} className='modal-input'>
        <AvForm onSubmit={::this.handleSaveChannelRegionSubmit} >
          <ModalHeader>
            { isNew ? '新增区域' : '编辑区域' }
          </ModalHeader>
          <ModalBody>
            <Container>
              <AvField name="name"
                value={channel_region.name}
                label="区域名称" type="text"
                placeholder="输入区域名称"
                grid={{md: 9}}
                onChange={(e) => {
                  this.setState({ channel_region: {...this.state.channel_region, name: e.target.value}})
                }}
                required
                validate={{pattern: { value: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[A-Za-z0-9])*$/ }}}
                errorMessage={{required: '输入区域名称', pattern: '区域名称只支持中文、英文、数字'}}
                />
              { this.renderChannelRegionUserField() }
              <FormGroup row>
                <Label md={3}>选择渠道</Label>
                <Col xs={12} md={9}>
                  <InputGroup>
                    <Input
                      type="select"
                      value={channel_region.channel_ids}
                      placeholder="选择渠道"
                      multiple
                      onChange={(e) => {
                        const channel_ids = Array.prototype.slice.call(e.target.selectedOptions).map(o => o.value);
                        this.setState({ channel_region: {...this.state.channel_region, channel_ids: channel_ids}})
                      }}
                      >
                      <option value="">选择渠道</option>
                      {
                        _.map(list, (channel) => {
                          return (
                            <option key={ channel.id } value={ channel.id }>{ channel.name }</option>
                          )
                        })
                      }
                    </Input>
                  </InputGroup>
                </Col>
              </FormGroup>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.hideChannelRegionModal() }>取消</Button>
            <Button color="primary">保存</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }

  handleEditChannelRegionStatus (channel_region) {
    const isLocked = channel_region.status === 'locked';
    const text = isLocked ? '激活' : '冻结'
    const status = isLocked ? 'normal' : 'locked';
    const opts = {
      id: channel_region.id,
      status
    }

    this.updateChannelRegion(opts, (res) => {
      if (Number(res.code) === 0) {
        _.merge(channel_region, opts);

        this.notificator.success({ text: `${text}区域成功` });
        this.setState({
          channel_region: {
            ...this.state.channel_region,
            status: res.data.status,
            status_text: res.data.status_text
          }
        });
      } else {
        this.notificator.error({ text: `${text}区域失败` });
      }
    });
  }

  async updateChannelRegion(opts = {}, callback) {
    const { channel_region } = this.state;

    try {
      const res = await this.props.updateChannelRegion({ channel_region: opts });
      if (_.isFunction(callback)) callback(res);
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  showChannelRegionChannelUserModal(channel_user) {
    this.setState({
      isShowChannelRegionChannelUser: true,
      channel_region_channel_user: channel_user
    });
  }

  cancelChangeChannelRegionChannelUser() {
    this.setState({
      isShowChannelRegionChannelUser: false,
      channel_region_channel_user: {}
    });
  }

  async updatechannelRegionChannelUser() {
    const { channel_region_channel_user } = this.state;
    const opts = _.pick(channel_region_channel_user, ['id', 'password']);

    try {
      const res = await this.props.updateChannelUser({ channel_user: opts });
      if (Number(res.code) === 0) {
        this.notificator.success({ text: '修改密码成功' });
        this.setState({
          isShowChannelRegionChannelUser: false,
          channel_region_channel_user: {}
        });
      } else {
        this.notificator.error({ text: '修改密码失败' });
      }
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  validChannelRegionChannelUserConfirmPassword() {
    const { channel_region_channel_user } = this.state;
    const isEmpty = _.isEmpty(channel_region_channel_user.password);
    const isEqual = _.isEqual(channel_region_channel_user.password, channel_region_channel_user.confirm_password);

    return !isEmpty && isEqual;
  }

  handleChannelRegionChannelUserSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.updatechannelRegionChannelUser();
  }

  renderChannelRegionChannelUserModal() {
    const { isShowChannelRegionChannelUser, channel_region_channel_user } = this.state;

    return (
      <Modal isOpen={isShowChannelRegionChannelUser} className='modal-input'>
      <AvForm onSubmit={this.handleChannelRegionChannelUserSubmit}>
        <ModalHeader>修改密码</ModalHeader>
        <ModalBody>
          <Container>
            <AvField name="password"
              label="密码" type="password"
              placeholder="输入密码"
              grid={{md: 9}}
              onChange={(e) => {
                this.setState({ channel_region_channel_user: {...this.state.channel_region_channel_user, password: e.target.value}})
              }}
              required
              minLength="6"
              errorMessage={{required: '密码不能为空', minLength: '密码不能少于6位'}}
              />
            <AvField name="confirm_password"
              label="密码" type="password"
              placeholder="输入密码"
              grid={{md: 9}}
              onChange={(e) => {
                this.setState({ channel_region_channel_user: {...this.state.channel_region_channel_user, confirm_password: e.target.value}})
              }}
              required
              validate={{custom: ::this.validChannelRegionChannelUserConfirmPassword }}
              errorMessage={{custom: '密码不一致' }}
              />
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.cancelChangeChannelRegionChannelUser() }>取消</Button>
          <Button color="primary">保存</Button>
        </ModalFooter>
        </AvForm>
      </Modal>
    );
  }

  renderListOperate(item) {
    if (!item) {
      return null
    }
    let statusTh = null;

    if (item.status === "normal") {
      statusTh = <Confirm
          buttonText="冻结"
          buttonBSStyle="danger"
          buttonSize="sm"
          onConfirm={(e) => this.handleEditChannelRegionStatus(item)}
          body="你确定要冻结大区吗?"
          confirmText="确定"
          title="提示" />
    } else {
      statusTh = <Confirm
          buttonText="激活"
          buttonBSStyle="warning"
          buttonSize="sm"
          onConfirm={(e) => this.handleEditChannelRegionStatus(item)}
          body="你确定要激活大区吗?"
          confirmText="确定"
          title="提示" />
    }

    return (
      <th>
        {statusTh}
        <Button size="sm" className='btn-edit' color="primary" onClick={() => this.handleEditChannelRegionClick(item) }>编辑</Button>
      </th>
    )
  }

  renderChannelRegionTr(channel_region) {
    channel_region.channel_ids = _.map(channel_region.channel_region_maps, 'channel_id');

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
                  <Button size="sm" className='btn-delete pull-right' onClick={() => this.showChannelRegionChannelUserModal(channel_user) } color="primary">
                    修改密码
                  </Button>
                </p>
              )
            })
          }
        </th>
        <th>
          {
            _.map(channel_region.channel_region_maps, (channel_region_map) => {
              const channel_users = channel_region_map.channel_users
              return (
                <p key={channel_region_map.id}>
                  {
                    _.map(channel_users, (channel_user) => {
                      return (
                        <span key={channel_user.id}>{channel_user.name} {channel_user.phone}</span>
                      )
                    })
                  }
                  <span className="pull-right">
                  <Confirm
                      buttonText="删除"
                      buttonBSStyle="warning"
                      buttonSize="sm"
                      onConfirm={(e) => this.handleDeleteChannelRegionMap(channel_region, channel_region_map)}
                      body="你确定要删除渠道吗?"
                      confirmText="确定"
                      title="提示" />
                  </span>
                </p>
              )
            })
          }
        </th>
        <th>{ fecha.format(new Date(channel_region.created_at), 'YYYY-MM-DD HH:mm:ss') }</th>
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
      return this.renderChannelRegionTr(channel_region)
    })
  }


  renderChannelRegionTable() {
    const { channel_regions: { isFetching, list, current_page } } = this.props.channel_region;
    const { isLoading, isNodata, networkError }  = this.state;

    return (
      <Table bordered size="sm">
        <thead>
          <tr>
            <th>序号</th>
            <th>区域名称</th>
            <th>渠道管理员</th>
            <th>渠道</th>
            <th>修改时间</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {
            this.renderChannelRegionTableTbody()
          }
        </tbody>
      </Table>
    );
  }

  handlePageChange(page) {
    this.fetch({ page });
  }

  render() {
    const { channel_regions } = this.props.channel_region;

    return (
      <div className='manage-setting'>
        <Card>
          <CardBody>
            <div className="pull-right">
              <Button color="primary" className='btn-add' onClick={() => this.handleAddChannelRegionClick() }>新增区域</Button>
            </div>
            { this.renderChannelRegionTable() }
            { this.renderChannelRegionModal() }
            { this.renderChannelRegionChannelUserModal() }
            <Paginator handlePageChange={::this.handlePageChange} {...this.props} collection={ channel_regions } />
            <Notificator ref="notificator" />
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default ChannelRegion;
