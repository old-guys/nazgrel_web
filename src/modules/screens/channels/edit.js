import React, {Component} from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Row, Col, Container, Label, InputGroup, Input, FormGroup
} from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ChannelApi from 'api/channel';
import ConstantSettingApi from 'api/constant_setting';

class EditChannel extends Component {
  constructor (props) {
    super(props);

    this.state = {
      channel: {},
      enumField: {},
      isOpen: false,
      saveBtnDisabled: false,
      cancelBtnDisabled: false
    };

    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setChannelInitialState(channel) {
    channel.channelCategory =channel.category;
    channel.channelSource = channel.source;
    this.setState({ channel });
  }

  async setEnumFieldInitialState(params = {}) {
    this.setState({
      cancelBtnDisabled: true,
      saveBtnDisabled: true
    });

    try {
      const res = await ConstantSettingApi.instance().enum_field();
      const data = res.data;

      this.setState({
        enumField: {
          channelCategory: data.channel.category,
          channelSource: data.channel.source,
          channelUserRoleType: data.channel_user.role_type
        },
        cancelBtnDisabled: false,
        saveBtnDisabled: false
      });
    } catch(e) {
      console.error(`failure to load enum field, ${e}`)
    }

    this.setState({
      cancelBtnDisabled: false,
      saveBtnDisabled: false
    });
  }

  showModal(channel) {
    this.setChannelInitialState(channel);
    this.setEnumFieldInitialState();
    this.setState({
      isOpen: true,
      cancelBtnDisabled: false,
      saveBtnDisabled: false
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
      const { channel } = this.state;
      const res = await ChannelApi.instance().update({
        channel: {
          id: channel.id,
          name: channel.name,
          city: channel.city,
          category: channel.channelCategory,
          source: channel.channelSource,
          channel_user: {
            password: channel.password
          }
        }
      });

      if (Number(res.code) === 0) {
        this.props.notificator.success({ text: `更新渠道成功` });
        this.setState({ isOpen: false });

        if (this.props.success) this.props.success(res);
      } else {
        this.props.notificator.error({ text: `更新渠道失败:${response.message}` });
      }

    } catch(e) {
      console.error(e);
      this.setState({ networkError: true });
    }

    this.setState({
      saveBtnDisabled: false,
      cancelBtnDisabled: false
    })
  }

  handleSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.handleSave();
  }

  render() {
    const { isOpen, channel, enumField, saveBtnDisabled, cancelBtnDisabled } = this.state;
    const { channelCategory, channelSource, channelUserRoleType } = this.state.enumField;

    return (
      <Modal isOpen={isOpen} className='channel-modal'>
        <AvForm onSubmit={this.handleSubmit} >
          { cancelBtnDisabled && <ModalHeader>编辑渠道</ModalHeader> }
          { !cancelBtnDisabled && <ModalHeader toggle={this.hideModal}>编辑渠道</ModalHeader> }
          <ModalBody>
            <Container>
              <AvField
                name="name"
                value={channel.name}
                label="渠道名称"
                type="text"
                placeholder="输入渠道名称"
                grid={{md: 9}}
                onChange={(e) => {
                  channel.name = e.target.value;
                  this.setState({ channel });
                }}
                required
                validate={{pattern: { value: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[A-Za-z0-9])*$/ }}}
                errorMessage={{required: '输入渠道名称', pattern: '渠道名称只支持中文、英文、数字'}}
              />
              <FormGroup row>
                <Label md={3}>密码</Label>
                <Col xs={12} md={9}>
                  <InputGroup>
                    <Input
                      name="password"
                      value={channel.password}
                      placeholder="输入渠道管理员密码"
                      onChange={(e) => {
                        channel.password = e.target.value;
                        this.setState({ channel });
                      }}
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label md={3}>城市</Label>
                <Col xs={12} md={9}>
                  <InputGroup>
                    <Input
                      value={channel.city}
                      placeholder="输入城市"
                      onChange={(e) => {
                        channel.city = e.target.value;
                        this.setState({ channel });
                      }}
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <AvField
                name="type"
                value={channel.channelCategory}
                label="渠道类型"
                type="select"
                required
                grid={{md: 9}}
                onChange={(e) => {
                  channel.channelCategory = e.target.value;
                  this.setState({ channel });
                }}
                errorMessage={{required: '请选择渠道类型'}}
              >
                {
                  _.map(channelCategory, (text, value) => {
                    return (
                      <option value={value} key={value}>{text}</option>
                    )
                  })
                }
              </AvField>
              <AvField name="name"
                value={channel.channelSource}
                label="渠道类型"
                type="select"
                required
                grid={{md: 9}}
                onChange={(e) => {
                  channel.channelSource = e.target.value;
                  this.setState({ channel });
                }}
                errorMessage={{required: '请选择渠道类型'}}
              >
                {
                  _.map(channelSource, (text, value) => {
                    return (
                      <option value={value} key={value}>{text}</option>
                    )
                  })
                }
              </AvField>
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

export default EditChannel;
