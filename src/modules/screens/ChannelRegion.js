import React, {Component} from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Progress,
  InputGroup, InputGroupAddon, Input, Row, Col, Container, Alert, Card, CardBody
} from 'reactstrap';

import fecha from 'fecha';
import { connect } from 'react-redux';

import './style.scss'
import Page from './../../components/Page/'
import { fetchChannelRegionAll } from '../reducers/channel_region';

@connect(state => ({
  channel_region: state.channel_region
}), { fetchChannelRegionAll })
class ChannelRegion extends Component {
  constructor (props) {
    super(props);

    this.state = {
      addManageModal: false,
      deleteManageModal: false,
      addChannelModal: false,
      isAddCR: false,
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

    console.log('addChannel')
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

  addChannelRegion() {
    const { isAddCR, channel_region } = this.state;

    console.log(channel_region)
  }

  renderAddChannelRegion() {
    const { isAddCR, channel_region } = this.state;

    return (
      <Modal isOpen={isAddCR} className='modal-input'>
        <ModalHeader>
          { _.isUndefined(channel_region.id) ? '新增渠道管理员' : '编辑渠道管理员' }
        </ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col xs='3'>渠道管理员</Col>
              <Col xs='9'>
                <InputGroup>
                  <Input
                    placeholder="输入渠道管理员名称"
                    value={channel_region.name}
                    onChange={(e) => {
                      channel_region.name = e.target.value
                    }} />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col xs='3'>主管手机号</Col>
              <Col xs='9'>
                <InputGroup>
                  <Input
                    placeholder="输入主管手机号，将作为登录账号"
                    value={channel_region.phone}
                    onChange={(e) => {
                      channel_region.phone = e.target.value
                    }}
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

  renderChannelRegion(channel_region) {
    return (
      <tr>
        <th>{ channel_region.id }</th>
        <th>王康</th>
        <th>13000000000</th>
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
          <Button size="sm" className='btn-edit' color="primary">冻结</Button>
          <Button size="sm" className='btn-edit' color="primary" onClick={() => this.showEditChannelRegionModal(channel_region) }>编辑</Button>
          <Button size="sm" className='btn-edit' color="primary" onClick={() => this.showAddChannelModal() }>添加渠道</Button>
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
            <th>渠道管理员</th>
            <th>管理员手机号</th>
            <th>渠道人员</th>
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
            <Button color="primary" className='btn-add' onClick={() => this.showAddChannelRegionModal() }>新增管理员</Button>
            { this.renderChannelRegions() }
            { this.renderAddChannelRegion() }
            { this.renderAddChannel() }
            { this.renderDeleteChannel() }
            <Page key='pagination' pageIndexChange={this.pageChangeHandle} {...this.state} />
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default ChannelRegion;
