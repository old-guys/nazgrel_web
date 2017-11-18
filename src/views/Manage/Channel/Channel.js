import React, {Component} from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter,
  InputGroup, InputGroupAddon, Input, Row, Col, Container, Alert
} from 'reactstrap';

import './style.scss'
class Channel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      channelModal: false,
      dangerModal: false
    }
  }

  channelToggle () {
    this.setState({ channelModal: !this.state.channelModal })
  }

  dangerToggle () {
    this.setState({ dangerModal: !this.state.dangerModal })
  }

  saveChannel () {
    this.setState({ dangerModal: !this.state.dangerModal })
  }

  render() {
    const { channelModal, dangerModal } = this.state

    return (
      <div className='channel-setting'>
        <Button className='add-people' color="primary" onClick={() => {this.channelToggle()}}>新增渠道人员</Button>
        <Table bordered size="sm">
          <thead>
            <tr>
              <th>序号</th>
              <th>渠道名称</th>
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
            <tr>
              <th>1</th>
              <th>北京总代</th>
              <th>xxx</th>
              <th>110</th>
              <th>1</th>
              <th>1</th>
              <th>1</th>
              <th>1</th>
              <th>
                <Button size="sm" color="primary">冻结</Button>
                <Button size="sm" color="primary">编辑</Button>
              </th>
            </tr>
            <tr>
              <th>1</th>
              <th>北京总代</th>
              <th>xxx</th>
              <th>110</th>
              <th>1</th>
              <th>1</th>
              <th>1</th>
              <th>1</th>
              <th>1</th>
            </tr>
          </tbody>
        </Table>
        <Modal isOpen={channelModal} className='channel-modal'>
          <ModalHeader>新增渠道人员</ModalHeader>
          <ModalBody>
            <Container>
              <Row>
                <Col xs='3'>店主手机号</Col>
                <Col xs='9'>
                  <InputGroup>
                    <Input placeholder="输入店主手机号" onChange={(e) => {console.log(e.target.value)}} innerRef={(ref) => {this.shopMobile = ref}} />
                    <Button color="primary">查询</Button>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col xs='3'>店主姓名</Col>
                <Col xs='9'>
                  <InputGroup>
                    <Input placeholder="输入店主姓名" />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col xs='3'>渠道名称</Col>
                <Col xs='9'>
                  <InputGroup>
                    <Input placeholder="输入渠道名称" />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col xs='3'>渠道类型</Col>
                <Col xs='9'>
                  <Input type="select" name="select">
                    <option>种子店主</option>
                    <option>一级代理</option>
                    <option>渠道经理</option>
                  </Input>
                </Col>
              </Row>
              <Row>
                <Col xs='3'>渠道分类</Col>
                <Col xs='9'>
                  <Input type="select" name="select">
                    <option>奥维斯</option>
                    <option>微差事</option>
                    <option>其他渠道</option>
                  </Input>
                </Col>
              </Row>
            </Container> 
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => {this.channelToggle()}}>取消</Button>
            <Button color="primary" onClick={() => {this.saveChannel()}}>保存</Button>
          </ModalFooter>
        </Modal>
        {/* <Modal isOpen={dangerModal} className='modal-danger'>
          <ModalHeader>提示</ModalHeader>
          <ModalBody>
            手机号格式错误
          </ModalBody>
          <ModalFooter>
            <Button color="danger" >确定</Button>
          </ModalFooter>
        </Modal> */}
        <Alert color="danger" isOpen={dangerModal} toggle={() => {this.dangerToggle()}}>
        手机号格式错误
        </Alert>
      </div>
    )
  }
}

export default Channel;
