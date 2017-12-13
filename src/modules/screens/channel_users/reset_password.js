import React, {Component} from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Container
} from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { ChannelUserApi } from '../../api';

class ResetPassword extends Component {

  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      channel_user: props.channel_user
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.validConfirmPassword = this.validConfirmPassword.bind(this);
  }

  showModal(channel_user) {
    this.setState({
      isOpen: true,
      channel_user
    });
  }

  hideModal() {
    this.setState({
      isOpen: false,
      channel_user: {}
    });
  }

  async handleSave() {
    const { channel_user } = this.state;
    const opts = _.pick(channel_user, ['id', 'password']);

    try {
      const res = await ChannelUserApi.instance().update({ channel_user: opts });
      if (Number(res.code) === 0) {
        this.props.notificator.success({ text: '修改密码成功' });
        this.setState({
          isOpen: false,
          channel_user: {}
        });
      } else {
        this.props.notificator.error({ text: '修改密码失败' });
      }
    } catch(e) {
      console.error(e);
      this.setState({ networkError: true });
    }
  }

  validConfirmPassword() {
    const { channel_user } = this.state;
    if (_.isEmpty(channel_user.password) || _.isEmpty(channel_user.confirm_password)) return true;

    return _.isEqual(channel_user.password, channel_user.confirm_password);
  }

  handleSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.handleSave();
  }

  render() {
    const { isOpen, channel_user } = this.state;

    return (
      <Modal isOpen={isOpen} className='modal-input'>
        <AvForm onSubmit={this.handleSubmit}>
        <ModalHeader>修改密码</ModalHeader>
        <ModalBody>
          <Container>
            <AvField name="password"
              label="密码" type="password"
              placeholder="输入密码"
              grid={{md: 9}}
              onChange={(e) => {
                channel_user.password = e.target.value;
                this.setState({ channel_user });
              }}
              required
              minLength="6"
              errorMessage={{required: '密码不能为空', minLength: '密码不能少于6位'}}
              />
            <AvField name="confirm_password"
              label="确认密码" type="password"
              placeholder="输入确认密码"
              grid={{md: 9}}
              onChange={(e) => {
                channel_user.confirm_password = e.target.value;
                this.setState({ channel_user });
              }}
              required
              validate={{custom: this.validConfirmPassword }}
              errorMessage={{required: '确认密码不能为空', custom: '密码不一致' }}
              />
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

export default ResetPassword;
