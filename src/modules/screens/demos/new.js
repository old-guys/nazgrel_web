import React, {Component} from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Container
} from 'reactstrap';
import { AvForm, AvGroup, AvField, AvInput, AvFeedback } from 'availity-reactstrap-validation';

import DemoApi from 'api/demo';
import DemoSelector from 'components/Selector/demo'

class NewDemo extends Component {

  constructor (props) {
    super(props);

    this.state = {
      demo: this.defaultDemo(),
      isOpen: false,
      saveBtnDisabled: false,
      cancelBtnDisabled: false
    };

    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  defaultDemo() {
    return {
      id: null,
      name: ""
    };
  }

  showModal() {
    this.setState({
      isOpen: true,
      saveBtnDisabled: false,
      cancelBtnDisabled: false,
      demo: this.defaultDemo()
    });
  }

  hideModal() {
    this.setState({ isOpen: false });
  }

  async handleSave() {
    this.setState({
      saveBtnDisabled: true,
      cancelBtnDisabled: true
    });

    try {
      const { demo } = this.state;
      const res = await DemoApi.instance().create({ demo });

      if (Number(res.code) === 0) {
        this.props.notificator.success({ text: '保存demo成功' });
        this.setState({ isOpen: false });

        if (this.props.success) this.props.success(res);
      } else {
        this.props.notificator.error({ text: `创建demo失败:${res.message}` });

        if (this.props.fail) this.props.fail(res);
      }
    } catch(e) {
      console.error(e);
      this.setState({ networkError: true });
    }

    this.setState({
      saveBtnDisabled: false,
      cancelBtnDisabled: false
    });
  }

  handleSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.handleSave();
  }

  render() {
    const { isOpen, demo, saveBtnDisabled, cancelBtnDisabled } = this.state;

    return (
      <Modal isOpen={isOpen} className='modal-input'>
        <AvForm onSubmit={this.handleSubmit} >
          { cancelBtnDisabled && <ModalHeader>新增DEMO</ModalHeader> }
          { !cancelBtnDisabled && <ModalHeader toggle={this.hideModal}>新增DEMO</ModalHeader> }
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
                errorMessage={{required: '输入区域名称', pattern: '区域名称只支持中文、英文、数字'}}
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
            <Button color="secondary" onClick={this.hideModal} disabled={cancelBtnDisabled}>取消</Button>
            <Button color="primary" disabled={saveBtnDisabled}>保存</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }
}

export default NewDemo;
