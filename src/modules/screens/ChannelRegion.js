import React, {Component} from 'react';
import {
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Progress,
  InputGroup, InputGroupAddon, Input, Row, Col, Container, Alert, Card, CardBody
} from 'reactstrap';

import fecha from 'fecha';
import { connect } from 'react-redux';

import './style.scss'
import Page from './../../components/Page/'
import {
  fetchChannelRegionAll,
  createChannelRegion,
  updateChannelRegion
} from '../reducers/channel_region';

@connect(state => ({
  channel_region: state.channel_region
}), { fetchChannelRegionAll, createChannelRegion, updateChannelRegion })
class ChannelRegion extends Component {
  constructor (props) {
    super(props);

    this.state = {
      deleteManageModal: false,
      addChannelModal: false,
      isAddCR: false,
      isLockedCR: false,
      channel_region: {}
    };
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch(params = {}) {
    const page = params.page || 1;
    const filters = params.filters !== undefined ? params.filters : this.state.filters;
    const json_key = params.json_key !== undefined ? params.json_key : this.state.json_key;
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
      const response = await this.props.fetchChannelRegionAll(optimizes);
      this.setState({ isLoading: false });
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  pageChangeHandle() {

  }

  showDeleteChannelModal(channel_user) {
    this.setState({
      deleteManageModal: true
    });
  }

  cancelDeleteChannel() {
    this.setState({
      deleteManageModal: false
    });
  }

  deleteChannel() {
    console.log('deleteChannel')
  }

  renderDeleteChannel() {
    const { deleteManageModal } = this.state

    return (
      <Modal isOpen={deleteManageModal} className='modal-input'>
        <ModalHeader>提示</ModalHeader>
        <ModalBody>
          确定删除此渠道人员
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.cancelDeleteChannel() }>取消</Button>
          <Button color="primary" onClick={() => this.deleteChannel() }>删除</Button>
        </ModalFooter>
      </Modal>
    );
  }

  showAddChannelModal() {
    this.setState({
      addChannelModal: true

    });
  }

  cancelAddChannel() {
    this.setState({
      addChannelModal: false
    });
  }

  addChannel() {
    const { isAddCR, channel_region } = this.state;


  }

  renderAddChannel() {
    const { addChannelModal } = this.state;

    return (
      <Modal isOpen={addChannelModal} className='modal-input'>
        <ModalHeader>添加渠道人员</ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col xs='3'>渠道人员</Col>
              <Col xs='9'>
                <InputGroup>
                  <Input placeholder="输入渠道手机号查询" />
                  <Button color="primary">查询</Button>
                </InputGroup>
                <Progress value="100" color='danger'>未查询到店主</Progress>
              </Col>
            </Row>
            <Row>
              <Col xs='3'>渠道名称</Col>
              <Col xs='9'>
                <InputGroup>
                  <Input placeholder="" />
                </InputGroup>
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.cancelAddChannel() }>取消</Button>
          <Button color="primary" onClick={() => this.addChannel() }>保存</Button>
        </ModalFooter>
      </Modal>
    );
  }

  renderChannel(channel_user) {
    return (
      <p>
        上海 {channel_user.name} {channel_user.phone}
        <Button size="sm" className='btn-delete' onClick={() => this.showDeleteChannelModal(channel_user) } color="primary">
          删除
        </Button>
      </p>
    );
  }

  setChannelRegion(element) {
    const { channel_region } = this.state;
    const names = element.target.name.split('.');
    const count = names.length;

    let str = 'channel_region'
    _.each(names, (name, i) => {
      str = `${str}['${name}']`;
      if (i === count - 1) {
        eval(`${str} = element.target.value`);
      } else {
        let value = eval(str);
        if (_.isUndefined(value)) eval(`${str} = {}`);
      }
    });
  }

  showEditChannelRegionModal(channel_region) {
    this.setState({
      isAddCR: true,
      channel_region: channel_region
    });
  }

  showAddChannelRegionModal() {
    this.setState({
      isAddCR: true,
      channel_region: {}
    });
  }

  cancelAddChannelRegion() {
    this.setState({
      isAddCR: false,
      channel_region: {}
    });
  }

  async addChannelRegion() {
    const { channel_region } = this.state;

    try {
      const response = await this.props.createChannelRegion({ channel_region });

      if (Number(response.code) === 0) {
        this.setState({
          isAddCR: false,
          channel_region: {}
        });
      } else {
        console.log('保存失败');
      }
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  renderAddChannelRegion() {
    const { isAddCR, channel_region } = this.state;
    const channel_user = channel_region.channel_user || {};
    const isNew = _.isUndefined(channel_region.id);

    return (
      <Modal isOpen={isAddCR} className='modal-input'>
        <ModalHeader>
          { isNew ? '新增区域' : '编辑区域' }
        </ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col xs='3'>区域名称</Col>
              <Col xs='9'>
                <InputGroup>
                  <Input
                    name = "name"
                    placeholder="输入区域名称"
                    value={channel_region.name}
                    onChange={(e) => this.setChannelRegion(e) }
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row className={ isNew ? '' : 'd-lg-none'}>
              <Col xs='3'>主管名称</Col>
              <Col xs='9'>
                <InputGroup>
                  <Input
                    name = "channel_user.name"
                    placeholder="输入主管名称"
                    value={channel_user.name}
                    onChange={(e) => this.setChannelRegion(e) }
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row className={ isNew ? '' : 'd-lg-none'}>
              <Col xs='3'>主管手机号</Col>
              <Col xs='9'>
                <InputGroup>
                  <Input
                    name = "channel_user.phone"
                    placeholder="输入主管手机号，将作为登录账号"
                    value={channel_user.phone}
                    onChange={(e) => this.setChannelRegion(e) }
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row className={ isNew ? '' : 'd-lg-none'}>
              <Col xs='3'>主管密码</Col>
              <Col xs='9'>
                <InputGroup>
                  <Input
                    name = "channel_user.password"
                    placeholder="输入主管密码，将作为登录账号的密码"
                    value={channel_user.password}
                    onChange={(e) => this.setChannelRegion(e) }
                  />
                </InputGroup>
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.cancelAddChannelRegion() }>取消</Button>
          <Button color="primary" onClick={() => this.addChannelRegion() }>保存</Button>
        </ModalFooter>
      </Modal>
    );
  }

  showLockedChannelRegionModal(channel_region) {
    this.setState({
      isLockedCR: true,
      channel_region: channel_region
    });
  }

  cancelLockedChannelRegion() {
    this.setState({
      isLockedCR: false,
      channel_region: {}
    });
  }

  lockedChannelRegion() {
    const { channel_region } = this.state;

    channel_region.status = 'locked';

    this.updateChannelRegion((res) => {
      if (Number(res.code) === 0) {
        this.setState({
          isLockedCR: false,
          channel_region: {}
        });
      } else {
        console.log('冻结失败');
      }
    });
  }

  async updateChannelRegion(callback) {
    const { channel_region } = this.state;

    try {
      const res = await this.props.updateChannelRegion({ channel_region });
      if (_.isFunction(callback)) callback(res);
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  renderLockedChannel() {
    const { isLockedCR } = this.state

    return (
      <Modal isOpen={isLockedCR} className='modal-input'>
        <ModalHeader>冻结区域</ModalHeader>
        <ModalBody>
          确定冻结此区域
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.cancelLockedChannelRegion() }>取消</Button>
          <Button color="primary" onClick={() => this.lockedChannelRegion() }>冻结</Button>
        </ModalFooter>
      </Modal>
    );
  }

  showActiveChannelRegionModal(channel_region) {

  }

  renderChannelRegion(channel_region) {
    const isLocked = channel_region.status === 'locked';
    const btnText = isLocked ? '激活' : '冻结';
    const onClickFun = () => {
      isLocked ? this.showActiveChannelRegionModal(channel_region) : this.showLockedChannelRegionModal(channel_region)
    }

    return (
      <tr>
        <th>{ channel_region.id }</th>
        <th>{ channel_region.name }</th>
        <th>
          {
            _.map(channel_region.channel_users, (channel_user) => {
              return (
                <p>
                  上海 {channel_user.name} {channel_user.phone}
                  <Button size="sm" className='btn-delete' onClick={() => this.showDeleteChannelModal(channel_user) } color="primary">
                    删除
                  </Button>
                </p>
              )
            })
          }
        </th>
        <th>
          {
            _.map(channel_region.channel_users, (channel_user) => {
              return this.renderChannel(channel_user)
            })
          }
        </th>
        <th>{ fecha.format(new Date(channel_region.created_at), 'YYYY-MM-DD HH:mm:ss') }</th>
        <th>{ fecha.format(new Date(channel_region.created_at), 'YYYY-MM-DD HH:mm:ss') }</th>
        <th>
          <Button size="sm" className='btn-edit' color="primary" onClick={ onClickFun }>{ btnText }</Button>
          <Button size="sm" className='btn-edit' color="primary" onClick={() => this.showEditChannelRegionModal(channel_region) }>编辑</Button>
        </th>
      </tr>
    );
  }

  renderChannelRegions() {
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
              return this.renderChannelRegion(channel_region)
            })
          }
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <div className='manage-setting'>
        <Card>
          <CardBody>
            <Button color="primary" className='btn-add' onClick={() => this.showAddChannelRegionModal() }>新增区域</Button>
            { this.renderChannelRegions() }
            { this.renderAddChannelRegion() }
            { this.renderAddChannel() }
            { this.renderDeleteChannel() }
            { this.renderLockedChannel() }
            <Page key='pagination' pageIndexChange={this.pageChangeHandle} {...this.state} />
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default ChannelRegion;
