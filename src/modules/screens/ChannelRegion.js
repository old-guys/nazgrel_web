import React, {Component} from 'react';
import {
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Progress,
  InputGroup, InputGroupAddon, Input, Row, Col, Container, Alert, Card, CardBody,
  FormGroup, Label, CardHeader, CardFooter
} from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import fecha from 'fecha';
import { connect } from 'react-redux';

import Paginator from './../../components/Paginator/'
import Notificator from './../../components/Notificator/'

import './style.scss'
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
      deleteManageModal: false,

      isShowCR: false,
      channel_region: {},
      copy_channel_region: {},
      isCRSattusChange: false,

      isShowCRChannelUser: false,
      cr_channel_user: {},

      isShowDeleteCRMModal: false,
      channel_region_map: {}

    };

    this.handleSaveCRSubmit = this.handleSaveCRSubmit.bind(this);
    this.handleChangeCRChannelUserSubmit = this.handleChangeCRChannelUserSubmit.bind(this);
  }

  componentDidMount() {
    this.notificator = this.refs.notificator;
    this.fetch();
    this.fetchChannelAll();
  }

  async fetch(params = {}) {
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

  showDeleteCRMModal(channel_region, channel_region_map) {
    this.setState({
      isShowDeleteCRMModal: true,
      channel_region_map,
      channel_region
    });
  }

  hideDeleteCRMModal() {
    this.setState({
      isShowDeleteCRMModal: false,
      channel_region_map: {},
      channel_region: {}
    });
  }

  async deleteCRMModal() {
    const { channel_region, channel_region_map } = this.state;

    try {
      const res = await this.props.deleteChannelRegionChannel({ channel_region_map });

      if (Number(res.code) === 0) {
        _.remove(channel_region.channel_region_maps, (crm) => {
          return crm.id === channel_region_map.id
        });

        this.notificator.success({ text: '删除渠道成功' });
        this.setState({
          isShowDeleteCRMModal: false,
          channel_region_map: {},
          channel_region: {}
        });
      } else {
        this.notificator.error({ text: '删除渠道失败' });
      }
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  renderDeleteCRMModal() {
    const { isShowDeleteCRMModal } = this.state

    return (
      <Modal isOpen={isShowDeleteCRMModal} className='modal-input'>
        <ModalHeader>删除渠道</ModalHeader>
        <ModalBody>
          确定删除此渠道
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.hideDeleteCRMModal() }>取消</Button>
          <Button color="primary" onClick={() => this.deleteCRMModal() }>删除</Button>
        </ModalFooter>
      </Modal>
    );
  }

  setEntityProperty(klass, event) {
    const entity = this.state[klass];
    const names = event.target.name.split('.');
    const count = names.length;
    const value = this.getElementValue(event);

    let str = 'entity'
    _.each(names, (name, i) => {
      str = `${str}['${name}']`;
      if (i === count - 1) {
        eval(`${str} = value`);
      } else {
        let value = eval(str);
        if (_.isUndefined(value)) eval(`${str} = {}`);
      }
    });

    this.setState({ klass });
  }

  getElementValue(event) {
    const target = event.target;
    const type = target.type;

    switch (type) {
      case 'select-multiple':
        const options = _.filter(target.options, { selected: true });
        const ids = _.map(options, (option) => {
          return Number(option.value);
        });

        return ids;
      default:
        return target.value;
    }
  }

  showCRModal(channel_region = {}) {
    this.setState({
      isShowCR: true,
      channel_region: channel_region,
      copy_channel_region: { ...channel_region }
    });
  }

  hideCRModal() {
    this.setState({
      isShowCR: false,
      channel_region: {},
      copy_channel_region: {}
    });
  }

  async saveCR() {
    let { channel_region, copy_channel_region } = this.state;
    const isNew = _.isUndefined(channel_region.id);
    const fun = isNew ? this.props.createChannelRegion : this.props.updateChannelRegion
    const opts = isNew ? copy_channel_region : _.pick(copy_channel_region, ['id', 'name', 'channel_ids']);

    try {
      const res = await fun({ channel_region: opts });

      if (Number(res.code) === 0) {
        if (isNew) {
          this.fetch();
        } else {
          _.merge(channel_region, res.data);
        }

        this.notificator.success({ text: '保存区域成功' });
        this.setState({
          isShowCR: false,
          channel_region: {},
          copy_channel_region: {}
        });
      } else {
        this.notificator.error({ text: '保存区域失败' });
      }
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  handleSaveCRSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.saveCR();
  }

  renderCRModal() {
    const { isShowCR, copy_channel_region } = this.state;
    const isNew = _.isUndefined(copy_channel_region.id);
    const channel_user = copy_channel_region.channel_user || {};
    const { channels: { isFetching, list, current_page } } = this.props.channel;

    return (
      <Modal isOpen={isShowCR} className='modal-input'>
        <AvForm onSubmit={::this.handleSaveCRSubmit} >
          <ModalHeader>
            { isNew ? '新增区域' : '编辑区域' }
          </ModalHeader>
          <ModalBody>
            <Container>
              <Row>
                <Col xs='3'>区域名称</Col>
                <Col xs='9' className='marbm20'>
                  <AvField name="name"
                    placeholder="输入区域名称"
                    value={copy_channel_region.name}
                    onChange={(e) => this.setEntityProperty('copy_channel_region', e) }
                    required
                    validate={{pattern: { value: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[A-Za-z0-9])*$/ }}}
                    errorMessage={{required: '输入区域名称', pattern: '区域名称只支持中文、英文、数字'}}
                  />
                </Col>
              </Row>
              <Row className={ isNew ? '' : 'd-lg-none'}>
                <Col xs='3'>主管名称</Col>
                <Col xs='9' className='marbm20'>
                  <AvField
                    name="channel_user.name"
                    placeholder="输入主管名称"
                    groupAttrs={{className: 'xxxx'}}
                    value={channel_user.name}
                    onChange={(e) => this.setEntityProperty('copy_channel_region', e) }
                    required={isNew}
                    validate={{pattern: { value: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[A-Za-z0-9])*$/ }}}
                    errorMessage={{required: '输入主管名称', pattern: '主管名称只支持中文、英文、数字'}}
                  />
                </Col>
              </Row>
              <Row className={ isNew ? '' : 'd-lg-none'}>
                <Col xs='3'>主管手机号</Col>
                <Col xs='9' className='marbm20'>
                  <AvField
                    name = "channel_user.phone"
                    type="tel"
                    placeholder="输入主管手机号，将作为登录账号"
                    value={channel_user.phone}
                    onChange={(e) => this.setEntityProperty('copy_channel_region', e) }
                    required={isNew}
                    errorMessage={{required: '输入主管手机号', tel: '手机号格式不正确'}}
                  />
                </Col>
              </Row>
              <Row className={ isNew ? '' : 'd-lg-none'}>
                <Col xs='3'>主管密码</Col>
                <Col xs='9' className='marbm20'>
                  <AvField
                    type="password"
                    name="channel_user.password"
                    placeholder="输入主管密码，将作为登录账号的密码"
                    value={channel_user.password}
                    onChange={(e) => this.setEntityProperty('copy_channel_region', e) }
                    required={isNew}
                    minLength="6"
                    errorMessage={{required: '输入主管密码', minLength: '密码不能少于6位'}}
                  />
                </Col>
              </Row>
              <FormGroup row>
                <Col xs='3'>
                  渠道
                </Col>
                <Col xs="12" md="9" size="lg">
                  <Input type="select" name="channel_ids" multiple value={copy_channel_region.channel_ids } onChange={(e) => this.setEntityProperty('copy_channel_region', e) }>
                    <option value="">选择渠道</option>
                    {
                      _.map(list, (channel) => {
                        return (
                          <option value={ channel.id }>{ channel.name }</option>
                        )
                      })
                    }
                  </Input>
                </Col>
              </FormGroup>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.hideCRModal() }>取消</Button>
            <Button color="primary">保存</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }

  showCRStatusModal(channel_region) {
    this.setState({
      isCRSattusChange: true,
      channel_region: channel_region
    });
  }

  cancelChangeCRStatus() {
    this.setState({
      isCRSattusChange: false,
      channel_region: {}
    });
  }

  changeCRStatus() {
    const { channel_region } = this.state;
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
          isCRSattusChange: false,
          channel_region: {}
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

  renderCRStatusModal() {
    const { isCRSattusChange, channel_region } = this.state;
    const isLocked = channel_region.status === 'locked';
    const text = isLocked ? '激活' : '冻结'

    return (
      <Modal isOpen={isCRSattusChange} className='modal-input'>
        <ModalHeader>{ text }区域</ModalHeader>
        <ModalBody>
          确定{ text }此区域
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.cancelChangeCRStatus() }>取消</Button>
          <Button color="primary" onClick={() => this.changeCRStatus() }>{ text }</Button>
        </ModalFooter>
      </Modal>
    );
  }

  showCRChannelUserModal(channel_user) {
    this.setState({
      isShowCRChannelUser: true,
      cr_channel_user: channel_user
    });
  }

  cancelChangeCRChannelUser() {
    this.setState({
      isShowCRChannelUser: false,
      cr_channel_user: {}
    });
  }

  async changeCRChannelUser() {
    const { cr_channel_user } = this.state;
    const opts = _.pick(cr_channel_user, ['id', 'password']);

    try {
      const res = await this.props.updateChannelUser({ channel_user: opts });
      if (Number(res.code) === 0) {
        this.notificator.success({ text: '修改密码成功' });
        this.setState({
          isShowCRChannelUser: false,
          cr_channel_user: {}
        });
      } else {
        this.notificator.error({ text: '修改密码失败' });
      }
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  validCRChannelUserConfirmPassword() {
    const { cr_channel_user } = this.state;
    const isEmpty = _.isEmpty(cr_channel_user.password);
    const isEqual = _.isEqual(cr_channel_user.password, cr_channel_user.confirm_password);

    return !isEmpty && isEqual;
  }

  handleChangeCRChannelUserSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.changeCRChannelUser();
  }

  renderCRChannelUserModal() {
    const { isShowCRChannelUser, cr_channel_user } = this.state;

    return (
      <Modal isOpen={isShowCRChannelUser} className='modal-input'>
      <AvForm onSubmit={this.handleChangeCRChannelUserSubmit}>
        <ModalHeader>修改密码</ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col xs='3'>密码</Col>
              <Col xs='9' className='marbm20'>
                <AvField
                  type="password"
                  name="password"
                  placeholder="输入密码"
                  onChange={(e) => this.setEntityProperty('cr_channel_user', e) }
                  required
                  minLength="6"
                  errorMessage={{required: '密码不能为空', minLength: '密码不能少于6位'}}
                />
              </Col>
            </Row>
            <Row>
              <Col xs='3'>确认密码</Col>
              <Col xs='9' className='marbm20'>
                <AvField
                  type="password"
                  name="confirm_password"
                  placeholder="输入确认密码"
                  onChange={(e) => this.setEntityProperty('cr_channel_user', e) }
                  validate={{custom: ::this.validCRChannelUserConfirmPassword }}
                  errorMessage={{custom: '密码不一致' }}
                />
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.cancelChangeCRChannelUser() }>取消</Button>
          <Button color="primary">保存</Button>
        </ModalFooter>
        </AvForm>
      </Modal>
    );
  }

  renderCRTr(channel_region) {
    const isLocked = channel_region.status === 'locked';
    const btnText = isLocked ? '激活' : '冻结';

    channel_region.channel_ids = _.map(channel_region.channel_region_maps, 'channel_id');

    return (
      <tr>
        <th>{ channel_region.id }</th>
        <th>{ channel_region.name }</th>
        <th>
          {
            _.map(channel_region.channel_users, (channel_user) => {
              return (
                <p>
                  {channel_user.name} {channel_user.phone}
                  <Button size="sm" className='btn-delete' onClick={() => this.showCRChannelUserModal(channel_user) } color="primary">
                    修改密码
                  </Button>
                </p>
              )
            })
          }
        </th>
        <th>
          {
            _.map(channel_region.channel_region_maps, (crm) => {
              const channel_users = crm.channel_users
              return (
                <pre>
                  {
                    _.map(channel_users, (cu) => {
                      return (
                        <p>{cu.name} {cu.phone}</p>
                      )
                    })
                  }
                  <Button size="sm" className='btn-delete' onClick={() => this.showDeleteCRMModal(channel_region, crm) } color="primary">
                    删除
                  </Button>
                </pre>
              )
            })
          }
        </th>
        <th>{ fecha.format(new Date(channel_region.created_at), 'YYYY-MM-DD HH:mm:ss') }</th>
        <th>{ fecha.format(new Date(channel_region.created_at), 'YYYY-MM-DD HH:mm:ss') }</th>
        <th>
          <Button size="sm" className='btn-edit' color="primary" onClick={() => this.showCRStatusModal(channel_region) }>{ btnText }</Button>
          <Button size="sm" className='btn-edit' color="primary" onClick={() => this.showCRModal(channel_region) }>编辑</Button>
        </th>
      </tr>
    );
  }

  renderCRTable() {
    const { channel_regions: { isFetching, list, current_page } } = this.props.channel_region;

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
            _.map(list, (channel_region) => {
              return this.renderCRTr(channel_region)
            })
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
            <Button color="primary" className='btn-add' onClick={() => this.showCRModal() }>新增区域</Button>
            { this.renderCRTable() }
            { this.renderCRModal() }
            { this.renderDeleteCRMModal() }
            { this.renderCRStatusModal() }
            { this.renderCRChannelUserModal() }
            <Paginator handlePageChange={::this.handlePageChange} {...this.props} collection={ channel_regions } />
            <Notificator ref="notificator" />
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default ChannelRegion;