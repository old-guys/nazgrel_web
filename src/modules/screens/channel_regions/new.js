import React, {Component} from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Container
} from 'reactstrap';
import { AvForm, AvGroup, AvField, AvInput, AvFeedback } from 'availity-reactstrap-validation';

import { ChannelRegionApi } from '../../api';
import ChannelSelector from '../../../components/Selector/channel'

class NewChannelRegion extends Component {

  constructor (props) {
    super(props);

    this.state = {
      channel_region: this.defaultChannelRegionOpts(),
      isOpen: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  defaultChannelRegionOpts() {
    return {
      id: null,
      name: "",
      channel_ids: [],
      channel_user: {
        name: "",
        phone: "",
        password: "",
        confirm_password: ""
      }
    };
  }

  showModal() {
    this.setState({
      isOpen: true,
      channel_region: this.defaultChannelRegionOpts()
    });
  }

  hideModal() {
    this.setState({ isOpen: false });
  }

  async handleSave() {
    const { channel_region } = this.state;

    try {
      const res = await ChannelRegionApi.instance().create({ channel_region });

      if (Number(res.code) === 0) {
        this.props.notificator.success({ text: '保存区域成功' });
        this.setState({ isOpen: false });

        if (this.props.success) this.props.success(res);
      } else {
        this.props.notificator.error({ text: `创建渠道失败:${res.message}` });

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
    const { isOpen, channel_region } = this.state;
    const channel_user = channel_region.channel_user || {};

    return (
      <Modal isOpen={isOpen} className='modal-input'>
        <AvForm onSubmit={this.handleSubmit} >
          <ModalHeader>新增区域</ModalHeader>
          <ModalBody>
            <Container>
              <AvField name="name"
                value={channel_region.name}
                label="区域名称" type="text"
                placeholder="输入区域名称"
                grid={{md: 9}}
                onChange={(e) => {
                  channel_region.name = e.target.value;
                  this.setState({ channel_region });
                }}
                required
                validate={{pattern: { value: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[A-Za-z0-9])*$/ }}}
                errorMessage={{required: '输入区域名称', pattern: '区域名称只支持中文、英文、数字'}}
              />
              <AvField name="channel_user[name]"
                value={channel_user.name}
                label="主管名称" type="text"
                placeholder="输入主管名称"
                grid={{md: 9}}
                onChange={(e) => {
                  channel_region.channel_user.name = e.target.value;

                  this.setState({
                    channel_region
                  })
                }}
                required
                validate={{pattern: { value: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[A-Za-z0-9])*$/ }}}
                errorMessage={{required: '输入主管名称', pattern: '区域名称只支持中文、英文、数字'}}
              />
              <AvField name="channel_user[phone]"
                value={channel_user.phone}
                label="主管手机号" type="phone"
                placeholder="输入主管手机号，将作为登录账号"
                grid={{md: 9}}
                onChange={(e) => {
                  channel_region.channel_user.phone = e.target.value;
                  this.setState({ channel_region });
                }}
                required
                errorMessage={{required: '输入主管手机号', phone: '手机号格式不正确'}}
              />
              <AvField name="channel_user[password]"
                value={channel_user.password}
                label="主管密码" type="password"
                placeholder="输入主管密码，将作为登录账号的密码"
                grid={{md: 9}}
                onChange={(e) => {
                  channel_region.channel_user.password = e.target.value;
                  this.setState({ channel_region });
                }}
                required
                minLength="6"
                errorMessage={{required: '输入主管密码', minLength: '密码不能少于6位'}}
              />
              <Row>
                <Col xs='3'>选择渠道</Col>
                <Col xs='9'>
                  <ChannelSelector
                    multi={true}
                    value={channel_region.selectedOptions}
                    clearable={false}
                    searchable={false}
                    onChange={(values) => {
                      channel_region.channel_ids = _.map(values, 'id');
                      this.setState({ channel_region });
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

export default NewChannelRegion;
