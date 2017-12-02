import React, {Component} from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Form,
  FormGroup, Label, InputGroup, InputGroupAddon, Input, Row, Col, Container, Alert
} from 'reactstrap';
import { AvForm, AvGroup, AvField, AvInput, AvFeedback } from 'availity-reactstrap-validation';

import { Confirm } from '../../components/Confirm/';
import Paginator from './../../components/Paginator/';

import { Notification } from 'react-pnotify';
import Notificator from './../../components/Notificator/';

import { connect } from 'react-redux';
import { fetchChannelAll, createChannel, updateChannel } from '../reducers/channel';
import { fetchShopkeeperCheck } from '../reducers/shopkeeper';
import { fetchConstantSettingEnumField } from '../reducers/constant_setting';
import _ from 'lodash';
import fecha from 'fecha';

// import './style.scss'
@connect(state => ({
    channels: state.channel,
    shopkeeper: state.shopkeeper,
    constant_setting: state.constant_setting
  }), {
    fetchChannelAll, createChannel, updateChannel,
    fetchShopkeeperCheck, fetchConstantSettingEnumField
})
class Channel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      queryShopkeeperDisabled: false,

      createDisabled: false,
      addChannelModal: false,
      addChannel: {
        channelCategory: null,
        source: null,
        name: "",
        city: "",
        shopkeeperPhone: "",
        shopkeeperName: "",
        password: Math.random().toString(36).substring(6),
        shopkeeperUserId: null
      },

      editChannelModal: false,
      editDisabled: false,
      editChannel: {
        id: null,
        channelCategory: null,
        source: null,
        name: "",
        city: "",
        shopkeeperPhone: "",
        shopkeeperName: "",
        password: Math.random().toString(36).substring(6),
        shopkeeperUserId: null
      },
      enumField: {
        channelCategory: {},
        channelSource: {},
        channelUserRoleType: {}
      }
    }
  }

  handleNewChannelClick() {
    this.setState({addChannelModal: true});
  }

  handleCreateChannelSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.createChannel();
  }

  handleUpdateChannelSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.updateChannel();
  }

  async handleEditChannel(id) {
    const { channels: { list } } = this.props.channels;
    const channel = _.find(list, (item) => id === item.id);

    this.setState({
      editChannel: {...this.state.editChannel,
        id: channel.id,
        channelCategory: channel.category,
        source: channel.source,
        name: channel.name,
        city: channel.city,
        password: null,
      },
      editChannelModal: true,
      editDisabled: false,
    });
  }

  async handleEditChannelStatus (id) {
    const { channels: { list } } = this.props.channels;
    const channel = _.find(list, (item) => id === item.id);
    const status = (channel.status === "normal") ? "locked" : "normal"

    try {
      const response = await this.props.updateChannel({
        id: channel.id,
        status: status,
      });

      if (Number(response.code) === 0) {
        this.notificator.success({ text: '更新渠道成功' });

        this.fetchChannel();
      } else {
        this.notificator.error({ text: `更新渠道失败:${response.message}` });
        console.log('更新渠道失败:', response);
      }
    } catch(e) {
      console.log(e)
      this.setState({
        networkError: true,
      });
    }
  }

  async createChannel () {
    const { addChannel } = this.state

    try {
      this.setState({createDisabled: true})
      const response = await this.props.createChannel({
        name: addChannel.name,
        category: addChannel.channelCategory,
        city: addChannel.city,
        shopkeeper_user_id: addChannel.shopkeeperUserId,
        channel_user: {
          name: addChannel.shopkeeperName,
          password: addChannel.password
        }
      });

      if (Number(response.code) === 0) {
        this.setState({
          addChannel: {
            channelCategory: null,
            source: null,
            name: '',
            shopkeeperPhone: '',
            shopkeeperName: '',
            password: Math.random().toString(36).substring(7),
            shopkeeperUserId: null
          },
          addChannelModal: false
        });
        this.notificator.success({ text: '创建渠道成功' });

        this.fetchChannel();
      } else {
        this.notificator.error({ text: `创建渠道失败:${response.message}` });
        console.log('创建渠道失败:', response);
      }
      this.setState({createDisabled: false})
    } catch(e) {
      console.log(e)
      this.setState({
        networkError: true,
        createDisabled: false
      });
    }
  }

  async updateChannel () {
    const { editChannel } = this.state

    try {
      this.setState({editDisabled: true})
      const response = await this.props.updateChannel({
        id: editChannel.id,
        name: editChannel.name,
        category: editChannel.channelCategory,
        city: editChannel.city,
        channel_user: {
          password: editChannel.password
        }
      });

      if (Number(response.code) === 0) {
        this.setState({
          editChannel: {
            id: null,
            channelCategory: null,
            source: null,
            name: "",
            city: "",
            shopkeeperPhone: "",
            shopkeeperName: "",
            password: Math.random().toString(36).substring(6),
            shopkeeperUserId: null
          },
          editChannelModal: false,
          editDisabled: false,
        });
        this.notificator.success({ text: `更新渠道成功` });

        this.fetchChannel();
      } else {
        this.notificator.error({ text: `更新渠道失败:${response.message}` });
        console.log('更新渠道失败:', response);
      }
      this.setState({editDisabled: false})
    } catch(e) {
      console.log(e)
      this.setState({
        networkError: true,
        editDisabled: false
      });
    }
  }

  handlePageChange(page) {
    this.fetchChannel({ page });
  }


  async queryShopkeeper () {
    try {
      this.setState({queryShopkeeperDisabled: true})
      const response = await this.props.fetchShopkeeperCheck({
        params: {
          phone: this.state.addChannel.shopkeeperPhone
        }
      });

      if (Number(response.code) === 0) {
        this.setState({
          addChannel: {...this.state.addChannel,
            shopkeeperPhone: response.data.user_phone,
            shopkeeperName: response.data.user_name,
            shopkeeperUserId: response.data.user_id,
            city: response.data.city,
          },
          createDisabled: false
        });
      } else {
        console.log('查询店主失败');
        this.notificator.info({ text: "查询店主失败！" });
        this.setState({
          createDisabled: true
        });
      }
      this.setState({queryShopkeeperDisabled: false})
    } catch(e) {
      console.log(e)
      this.setState({
        networkError: true,
        queryShopkeeperDisabled: false
      });
    }
  }

  componentDidMount () {
    this.notificator = this.refs.notificator;

    this.fetchChannel();
    this.fetchConstantSettingEnumField()
  }

  async fetchChannel(params) {
    try {
      const response = await this.props.fetchChannelAll(params);
      this.setState({
        isLoading: false,
      });
    } catch(e) {
      console.error(`failure to load enum field, ${e}`)
      this.setState({ networkError: true });
    }
  }

  async fetchConstantSettingEnumField(params = {}) {
    try {
      const response = await this.props.fetchConstantSettingEnumField({});
      this.setState({
        enumField: {
          ...this.state.enumField,
          channelCategory: response.data.channel.category,
          channelSource: response.data.channel.source,
          channelUserRoleType: response.data.channel_user.role_type
        }
      });
    } catch(e) {
      console.error(`failure to load enum field, ${e}`)
    }
  }

  renderNav() {
    return (
      <div class="pull-right">
        <Button color="primary" onClick={() => this.handleNewChannelClick()}>新增渠道</Button>
      </div>
    )
  }

  renderListOperate(item) {
    if (!item) {
      return null
    }

    if (item.status === "normal") {
      return (
        <Confirm
            buttonText="冻结"
            buttonBSStyle="danger"
            buttonSize="sm"
            onConfirm={(e) => this.handleEditChannelStatus(item.id)}
            body="你确定要冻结渠道吗?"
            confirmText="确定"
            title="提示">
        </Confirm>
      )
    } else {
      return (
        <Button size="sm"
          onClick={() => this.handleEditChannelStatus(item.id)}
          cssModule={{ margin: 10}} color="warning">激活
        </Button>
      )
    }
  }

  renderList() {
    const { channels: { isFetching, list, current_page } } = this.props.channels;
    const { networkError, isLoading } = this.state;

    if (isLoading) {
      // return <LoadingView transparent={true} text="数据加载中..." />;
    } else if (networkError) {
      // return (<Nodata info="网络错误..." />);
    } else if (!list.length) {
      // return (<Nodata info="暂无数据..." />);
    }

    return (
      <tbody>
        {
          _.map(list, (item) => {
            return (
              <tr key={ item.id }>
                <th>{ item.id }</th>
                <th>{ item.name }</th>
                <th>{ item.shopkeeper_name }</th>
                <th>{ item.shopkeeper_phone }</th>
                <th>{ item.category_text }</th>
                <th>{ item.source_text }</th>
                <th>{ fecha.format(new Date(item.updated_at), 'YYYY-MM-DD HH:mm:ss') }</th>
                <th>{ fecha.format(new Date(item.created_at), 'YYYY-MM-DD HH:mm:ss') }</th>
                <th>
                  { this.renderListOperate(item) }
                  <Button size="sm" color="primary" onClick={() => this.handleEditChannel(item.id)}>编辑</Button>
                </th>
              </tr>
            )
          })
        }
      </tbody>
    );
  }

  renderChannelList() {
    return (
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
        { this.renderList() }
      </Table>
    );
  }

  renderAddChannel() {
    const { addChannelModal, queryShopkeeperDisabled, addChannel, createDisabled, enumField} = this.state;
    const { channelCategory, channelSource, channelUserRoleType } = this.state.enumField;

    return (
      <Modal isOpen={addChannelModal} className='channel-modal'>
        <AvForm onSubmit={::this.handleCreateChannelSubmit} >
          <ModalHeader>新增渠道</ModalHeader>
          <ModalBody>
            <Container>
              <AvGroup row>
                <Label md={3}>店主手机号</Label>
                <Col xs={12} md={9}>
                  <InputGroup>
                    <AvInput name="shopkeeperPhone"
                      value={addChannel.shopkeeperPhone}
                      className="form-control"
                      placeholder="输入店主手机号"
                      value={addChannel.shopkeeperPhone}
                      onChange={(e) => {
                        this.setState({ addChannel: {...this.state.addChannel, shopkeeperPhone: e.target.value}})
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
                      value={addChannel.shopkeeperName}
                      placeholder="输入店主姓名"
                      onChange={(e) => {
                        this.setState({ addChannel: {...this.state.addChannel, shopName: e.target.value}})
                      }}/>
                  </InputGroup>
                </Col>
              </FormGroup>
              <AvField name="password"
                value={addChannel.password}
                label="密码" type="text"
                placeholder="输入渠道管理员密码"
                grid={{md: 9}}
                onChange={(e) => {
                  this.setState({ addChannel: {...this.state.addChannel, password: e.target.value}})
                }}
                required
                errorMessage={{required: '输入渠道管理员密码'}}
                />
              <AvField name="name"
                value={addChannel.name}
                label="渠道名称" type="text"
                placeholder="输入渠道名称"
                grid={{md: 9}}
                onChange={(e) => {
                  this.setState({ addChannel: {...this.state.addChannel, name: e.target.value}})
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
                      value={addChannel.city}
                      placeholder="输入城市"
                      onChange={(e) => {
                        this.setState({ addChannel: {...this.state.city, name: e.target.value}})
                      }}/>
                  </InputGroup>
                </Col>
              </FormGroup>
              <AvField name="name"
                value={addChannel.channelCategory}
                label="渠道类型" type="select"
                required
                grid={{md: 9}}
                onChange={(e) => {
                  this.setState({ addChannel: {...this.state.addChannel, channelCategory: e.target.value}})
                }}
                errorMessage={{required: '请选择渠道类型'}}
                >
                  {
                    _.map(channelCategory, (value, key) => {
                      return (
                        <option value={key}>{value}</option>
                      )
                    })
                  }
              </AvField>
              <AvField name="name"
                value={addChannel.source}
                label="渠道类型" type="select"
                required
                grid={{md: 9}}
                onChange={(e) => {
                  this.setState({ addChannel: {...this.state.addChannel, source: e.target.value}})
                }}
                errorMessage={{required: '请选择渠道类型'}}
                >
                  {
                    _.map(channelSource, (value, key) => {
                      return (
                        <option value={key}>{value}</option>
                      )
                    })
                  }
              </AvField>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.setState({ addChannelModal: false })}>取消</Button>
            <Button color="primary" disabled={createDisabled}>保存</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }

  renderEditChannel() {
    const { editChannel, editChannelModal, editDisabled, enumField} = this.state;
    const { channelCategory, channelSource, channelUserRoleType } = this.state.enumField;

    return (
      <Modal isOpen={editChannelModal} className='channel-modal'>
        <AvForm onSubmit={::this.handleUpdateChannelSubmit} >
          <ModalHeader>编辑渠道</ModalHeader>
          <ModalBody>
            <Container>
              <AvField name="name"
                value={editChannel.name}
                label="渠道名称" type="text"
                placeholder="输入渠道名称"
                grid={{md: 9}}
                onChange={(e) => {
                  this.setState({ addChannel: {...this.state.editChannel, name: e.target.value}})
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
                      value={editChannel.password}
                      placeholder="输入渠道管理员密码"
                      onChange={(e) => {
                        this.setState({ editChannel: {...this.state.editChannel, password: e.target.value}})
                      }}/>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label md={3}>城市</Label>
                <Col xs={12} md={9}>
                  <InputGroup>
                    <Input
                      value={editChannel.city}
                      placeholder="输入城市"
                      onChange={(e) => {
                        this.setState({ editChannel: {...this.state.city, name: e.target.value}})
                      }}/>
                  </InputGroup>
                </Col>
              </FormGroup>
              <AvField name="name"
                value={editChannel.channelCategory}
                label="渠道类型" type="select"
                required
                grid={{md: 9}}
                onChange={(e) => {
                  this.setState({ editChannel: {...this.state.editChannel, channelCategory: e.target.value}})
                }}
                errorMessage={{required: '请选择渠道类型'}}
                >
                  {
                    _.map(channelCategory, (value, key) => {
                      return (
                        <option value={key}>{value}</option>
                      )
                    })
                  }
              </AvField>
              <AvField name="name"
                value={editChannel.source}
                label="渠道类型" type="select"
                required
                grid={{md: 9}}
                onChange={(e) => {
                  this.setState({ addChannel: {...this.state.editChannel, source: e.target.value}})
                }}
                errorMessage={{required: '请选择渠道类型'}}
                >
                  {
                    _.map(channelSource, (value, key) => {
                      return (
                        <option value={key}>{value}</option>
                      )
                    })
                  }
              </AvField>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.setState({ editChannelModal: false })}>取消</Button>
            <Button color="primary" disabled={editDisabled} >保存</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }

  render() {
    const { channels } = this.props.channels;

    return (
      <div className='channel-setting'>
        <Card>
          <CardBody>
            { this.renderNav() }
            { this.renderChannelList() }

            { this.renderAddChannel() }
            { this.renderEditChannel() }

            <Notificator ref="notificator" />
            <Paginator handlePageChange={::this.handlePageChange} {...this.props} collection={ channels } />
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default Channel;
