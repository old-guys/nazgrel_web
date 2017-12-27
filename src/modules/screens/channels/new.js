import React, {Component} from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Row, Col, Container, Label, InputGroup, Input, FormGroup
} from 'reactstrap';
import { AvForm, AvGroup, AvField, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { ChannelApi, ConstantSettingApi, ShopkeeperApi } from '../../api';

class NewChannel extends Component {
  constructor (props) {
    super(props);

    this.state = {
      queryShopkeeperDisabled: this.defaultQueryShopkeeperDisabled(),
      channel: this.defaultChannel(),
      enumField: this.defaultEnumField(),
      isOpen: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  defaultQueryShopkeeperDisabled() {
    return false;
  }

  defaultChannel() {
    return {
      channelCategory: null,
      source: null,
      name: "",
      city: "",
      shopkeeperPhone: "",
      shopkeeperName: "",
      password: Math.random().toString(36).substring(6),
      shopkeeperUserId: null
    };
  }

  defaultEnumField() {
    return {};
  }

  setChannelInitialState() {
    const channel = this.defaultChannel();

    channel.password = Math.random().toString(36).substring(6);
    this.setState({
      channel,
      queryShopkeeperDisabled: this.defaultQueryShopkeeperDisabled()
    });
  }

  async setEnumFieldInitialState(params = {}) {
    try {
      const res = await ConstantSettingApi.instance().enum_field();
      const data = res.data;

      this.setState({
        enumField: {
          channelCategory: data.channel.category,
          channelSource: data.channel.source,
          channelUserRoleType: data.channel_user.role_type
        }
      });
    } catch(e) {
      console.error(`failure to load enum field, ${e}`)
    }
  }

  async queryShopkeeper() {
    try {
      this.setState({ queryShopkeeperDisabled: true });

      const res = await ShopkeeperApi.instance().check({ phone: this.state.channel.shopkeeperPhone });

      if (Number(res.code) === 0) {
        this.setState({
          channel: {...this.state.channel,
            shopkeeperPhone: res.data.user_phone,
            shopkeeperName: res.data.user_name,
            shopkeeperUserId: res.data.user_id,
            city: res.data.city,
          },
          createDisabled: false
        });
      } else {
        this.props.notificator.info({ text: "查询店主失败！" });
        this.setState({ createDisabled: true });
      }
      this.setState({ queryShopkeeperDisabled: false });
    } catch(e) {

      console.error(e);
      this.setState({
        networkError: true,
        queryShopkeeperDisabled: false
      });

    }
  }

  showModal() {
    this.setChannelInitialState();
    this.setEnumFieldInitialState();
    this.setState({ isOpen: true });
  }

  hideModal() {
    this.setState({ isOpen: false });
  }

  async handleSave () {
    const { channel } = this.state

    try {
      this.setState({ createDisabled: true })
      const res = await ChannelApi.instance().create({
        channel: {
          name: channel.name,
          city: channel.city,
          category: channel.channelCategory,
          source: channel.channelSource,
          shopkeeper_user_id: channel.shopkeeperUserId,
          channel_user: {
            name: channel.shopkeeperName,
            password: channel.password
          }
        }
      });

      if (Number(res.code) === 0) {
        this.props.notificator.success({ text: '创建渠道成功' });
        this.setState({ isOpen: false });

        if (this.props.success) this.props.success(res);
      } else {
        this.props.notificator.error({ text: `创建渠道失败:${res.message}` });
      }
      this.setState({createDisabled: false})
    } catch(e) {
      console.error(e)
      this.setState({
        networkError: true,
        createDisabled: false
      });
    }
  }

  handleSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.handleSave();
  }

  render() {
    const { isOpen, channel, queryShopkeeperDisabled, createDisabled } = this.state;
    const { enumField: { channelCategory, channelSource } } = this.state;

    return (
      <Modal isOpen={isOpen} className='channel-modal'>
        <AvForm onSubmit={this.handleSubmit} >
          <ModalHeader>新增渠道</ModalHeader>
          <ModalBody>
            <Container>
              <AvGroup row>
                <Label md={3}>店主手机号</Label>
                <Col xs={12} md={9}>
                  <InputGroup>
                    <AvInput
                      name="shopkeeperPhone"
                      value={channel.shopkeeperPhone}
                      className="form-control"
                      placeholder="输入店主手机号"
                      value={channel.shopkeeperPhone}
                      onChange={(e) => {
                        channel.shopkeeperPhone = e.target.value;
                        this.setState({ channel })
                      }}
                      required
                      validate={{pattern: { value: /^([0-9])*$/ }}}
                      errorMessage={{required: '输入店主手机号', pattern: '手机号只支持数字'}}
                     />
                    <Button disabled={queryShopkeeperDisabled} onClick={() => this.queryShopkeeper()} color="primary">查询</Button>
                  </InputGroup>
                  <AvFeedback>输入店主手机号,只支持数字!</AvFeedback>
                </Col>
              </AvGroup>
              <FormGroup row>
                <Label md={3}>店主姓名</Label>
                <Col xs={12} md={9}>
                  <InputGroup>
                    <Input readOnly required
                      value={channel.shopkeeperName}
                      placeholder="输入店主姓名"
                      onChange={(e) => {
                        channel.shopName = e.target.value;
                        this.setState({ channel });
                      }}
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <AvField
                name="password"
                value={channel.password}
                label="密码"
                type="text"
                placeholder="输入渠道管理员密码"
                grid={{md: 9}}
                onChange={(e) => {
                  channel.password = e.target.value;
                  this.setState({ channel });
                }}
                required
                errorMessage={{required: '输入渠道管理员密码'}}
              />
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
                name="channelCategory"
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
                <option value="" key="blank">选择渠道类型</option>
                {
                  _.map(channelCategory, (text, value) => {
                    return (
                      <option value={value} key={value}>{text}</option>
                    )
                  })
                }
              </AvField>
              <AvField
                name="source"
                value={channel.channelSource}
                label="渠道类型"
                type="select"
                required
                grid={{md: 9}}
                onChange={(e) => {
                  channel.channelSource = e.target.value;
                  this.setState({ channel });
                }}
                errorMessage={{required: '请选择渠道来源'}}
              >
                <option value="" key="blank">请选择渠道来源</option>
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
            <Button color="secondary" onClick={() => this.hideModal() }>取消</Button>
            <Button color="primary" disabled={createDisabled}>保存</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }
}

export default NewChannel;
