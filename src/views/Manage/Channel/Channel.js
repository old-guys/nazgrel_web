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
      dangerModal: false,
      queryDisabled: false,
      saveDisabled: true,
      channerType: '', 
      channerClass: '', 
      channerName: '', 
      shopPhone: '', 
      shopName: '',
      password: '',
    }
  }

  channelToggle () {
    this.setState({ channelModal: !this.state.channelModal })
  }

  dangerToggle () {
    this.setState({ dangerModal: false })
  }

  saveChannel () {
    const { channerType, channerClass, channerName, shopPhone, shopName } = this.state
    this.setState({ dangerModal: true })
  }

  queryPhone () {
    this.setState({queryDisabled: true})

    setTimeout(() => {
      this.setState({queryDisabled: false})
    }, 5000)
  }

  render() {
    const { channelModal, dangerModal, queryDisabled, channerType, password,
      channerClass, channerName, shopPhone, shopName, saveDisabled} = this.state

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
                <Button size="sm" cssModule={{ margin: 10}} color="primary">冻结</Button>
                <Button size="sm" color="primary" onClick={() => {this.channelToggle()}}>编辑</Button>
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
                    <Input
                      placeholder="输入店主手机号" 
                      value={shopPhone} 
                      onChange={(e) => {
                        this.setState({ shopPhone: e.target.value})
                      }} />
                    <Button disabled={queryDisabled} onClick={() => {this.queryPhone()}} color="primary">查询</Button>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col xs='3'>店主姓名</Col>
                <Col xs='9'>
                  <InputGroup>
                    <Input 
                      value={shopName} 
                      placeholder="输入店主姓名" 
                      onChange={(e) => {
                        this.setState({ shopName: e.target.value})
                      }}/>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col xs='3'>密码</Col>
                <Col xs='9'>
                  <InputGroup>
                    <Input
                      type="password"
                      value={password} 
                      placeholder="输入店主姓名" 
                      onChange={(e) => {
                        this.setState({ password: e.target.value})
                      }}/>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col xs='3'>渠道名称</Col>
                <Col xs='9'>
                  <InputGroup>
                    <Input 
                      value={channerName} 
                      placeholder="输入渠道名称" 
                      onChange={(e) => {
                        this.setState({ channerName: e.target.value})
                      }}/>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col xs='3'>渠道类型</Col>
                <Col xs='9'>
                  <Input 
                    type="select" 
                    value={channerType} 
                    onChange={(e) => {
                      this.setState({ channerType: e.target.value})
                    }}>
                    <option>种子店主</option>
                    <option>一级代理</option>
                    <option>渠道经理</option>
                  </Input>
                </Col>
              </Row>
              <Row>
                <Col xs='3'>渠道分类</Col>
                <Col xs='9'>
                  <Input 
                    type="select" 
                    name="select" 
                    value={channerClass}
                    onChange={(e) => {
                      this.setState({ channerClass: e.target.value})
                    }}>
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
            <Button color="primary" disabled={saveDisabled} onClick={() => {this.saveChannel()}}>保存</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={dangerModal} className='modal-danger'>
          <ModalHeader>提示</ModalHeader>
          <ModalBody>
            手机号格式错误
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => {this.dangerToggle()}}>确定</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default Channel;
