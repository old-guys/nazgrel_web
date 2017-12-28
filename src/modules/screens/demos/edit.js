import React, {Component} from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Container
} from 'reactstrap';
import { AvForm, AvGroup, AvField, AvInput, AvFeedback } from 'availity-reactstrap-validation';

import DemoApi from 'api/demo';
import DemoSelector from 'components/Selector/demo'

class EditDemo extends Component {

  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      demo: props.demo
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModal(demo = {}) {
    this.setState({ demo, isOpen: true });
  }

  hideModal() {
    this.setState({ isOpen: false });
  }

  async handleSave() {
    const { demo } = this.state;
    const opts = _.pick(demo, ['id', 'name']);

    try {
      const res = await DemoApi.instance().update({ demo: opts });

      if (Number(res.code) === 0) {
        this.props.notificator.success({ text: '保存demo成功' });
        this.setState({ isOpen: false });

        if (this.props.success) this.props.success(res.data);
      } else {
        this.props.notificator.error({ text: `保存demo失败:${res.message}` });

        if (this.props.fail) this.props.fail(res);
      }
    } catch(e) {
      console.error(e);
      this.setState({ networkError: true });
    }
  }

  handleSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.handleSave();
  }

  render() {
    const { isOpen, demo } = this.state;

    return (
      <Modal isOpen={isOpen} className='modal-input'>
        <AvForm onSubmit={this.handleSubmit} >
          <ModalHeader>编辑demo</ModalHeader>
          <ModalBody>
            <Container>
              <AvField
                name="name"
                value={demo.name}
                label="demo名称"
                type="text"
                placeholder="输入demo名称"
                grid={{md: 9}}
                onChange={(e) => {
                  demo.name = e.target.value;
                  this.setState({ demo });
                }}
                required
                validate={{pattern: { value: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[A-Za-z0-9])*$/ }}}
                errorMessage={{required: '输入demo名称', pattern: '区域demo只支持中文、英文、数字'}}
              />
              <Row>
                <Col xs='3'>选择demo</Col>
                <Col xs='9'>
                  <DemoSelector
                    multi={true}
                    value={demo.selectedOptions}
                    clearable={false}
                    searchable={false}
                    onChange={(values) => {
                      demo.demo_ids = _.map(values, 'id');
                      this.setState({ demo });
                    }}
                  />
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.hideModal() }>取消</Button>
            <Button color="primary">保存</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }
}

export default EditDemo;
