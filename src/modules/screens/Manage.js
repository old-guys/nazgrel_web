import React, {Component} from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter,
  InputGroup, InputGroupAddon, Input, Row, Col, Container, Alert, Card, CardBody
} from 'reactstrap';


import './style.scss'

class Manage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      addManageModal: false,
      deleteManageModal: false,
      addChannelModal: false
    }
  }

  


  


  render() {
    const { addManageModal, deleteManageModal, addChannelModal } = this.state

    return (
      <div className='manage-setting'>
        <Card>
          <CardBody>
            <Button color="primary" className='btn-add' onClick={() => this.setState({addManageModal: true})}>新增管理员</Button>
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
                <tr>
                    <th>1</th>
                    <th>王康</th>
                    <th>13000000000</th>
                    <th>
                      <p>上海 XXX 1300000000<Button size="sm" className='btn-delete' onClick={() => this.setState({deleteManageModal: true})} color="primary">删除</Button></p>
                      <p>上海 XXX 1300000000<Button size="sm" className='btn-delete' color="primary">删除</Button></p>
                      <p>上海 XXX 1300000000<Button size="sm" className='btn-delete' color="primary">删除</Button></p>
                      
                    </th>
                    <th>2017年11月28日11:21:26</th>
                    <th>2017年11月28日11:21:32</th>
                    <th>
                      <Button size="sm" className='btn-edit' color="primary">冻结</Button>
                      <Button size="sm" className='btn-edit' color="primary">编辑</Button>
                      <Button size="sm" className='btn-edit' color="primary" onClick={() => {this.setState({addChannelModal: true})}}>添加渠道</Button>
                    </th>
                  </tr>
              </tbody>
            </Table>

            <Modal isOpen={addManageModal} className='modal-input'>
              <ModalHeader>提示</ModalHeader>
              <ModalBody>
                <Container>
                  <Row>
                    <Col xs='3'>渠道管理员</Col>
                    <Col xs='9'>
                      <InputGroup>
                        <Input placeholder="输入渠道管理员名称" />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs='3'>主管手机号</Col>
                    <Col xs='9'>
                      <InputGroup>
                        <Input placeholder="输入主管手机号，将作为登录账号" />
                      </InputGroup>
                    </Col>
                  </Row>
                </Container> 
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={() => this.setState({addManageModal: false})}>取消</Button>
                <Button color="primary" onClick={() => this.setState({addManageModal: false})}>确定</Button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={addChannelModal} className='modal-input'>
              <ModalHeader>提示</ModalHeader>
              <ModalBody>
                <Container>
                  <Row>
                    <Col xs='3'>渠道人员</Col>
                    <Col xs='9'>
                      <InputGroup>
                        <Input placeholder="输入渠道手机号查询" />
                        <Button color="primary">查询</Button>
                      </InputGroup>
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
                <Button color="secondary" onClick={() => this.setState({addChannelModal: false})}>取消</Button>
                <Button color="primary" onClick={() => this.setState({addChannelModal: false})}>报错</Button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={deleteManageModal} className='modal-input'>
              <ModalHeader>提示</ModalHeader>
              <ModalBody>
                确定删除此渠道人员
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={() => this.setState({deleteManageModal: false})}>取消</Button>
                <Button color="primary" onClick={() => this.setState({deleteManageModal: false})}>删除</Button>
              </ModalFooter>
            </Modal>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default Manage;
