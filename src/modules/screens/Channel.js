import React, {Component} from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Form,
  FormGroup, Label, InputGroup, InputGroupAddon, Input, Row, Col, Container, Alert
} from 'reactstrap';

import { connect } from 'react-redux';
import { fetchChannelAll } from '../reducers/channel';
import { fetchShopkeeperCheck } from '../reducers/shopkeeper';
import { fetchConstantSettingEnumField } from '../reducers/constant_setting';
import _ from 'lodash';
import fecha from 'fecha';

// import './style.scss'
@connect(state => ({
  channel: state.channel,
  shopkeeper: state.shopkeeper,
  enum_field: state.enum_field
}), { fetchChannelAll, fetchShopkeeperCheck, fetchConstantSettingEnumField })
class Channel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      channelModal: false,
      addChannelModal: false,
      queryShopkeeperDisabled: false,
      showNoShopkeeperModal: false,
      saveDisabled: true,
      addChannel: {
        channelType: null,
        source: null,
        name: '',
        shopkeeperPhone: '',
        shopkeeperName: '',
        password: Math.random().toString(36).substring(7),
      },
      enumField: {
        channelCategory: {},
        channelSource: {},
        channelUserRoleType: {}
      }
    }
  }

  channelToggle () {
    this.setState({ addChannelModal: !this.state.addChannelModal })
  }

  saveChannel () {
    const { channerType, channerClass, channerName, shopPhone, shopName } = this.state
  }

  async queryShopkeeper () {
    try {
      this.setState({queryShopkeeperDisabled: true})
      const response = await this.props.fetchShopkeeperCheck({
        params: {
          phone: this.state.addChannel.shopkeeperPhone
        }
      });
      console.log()

      if (Number(response.code) === 0) {
        this.setState({
          addChannel: {...this.state.addChannel,
            shopkeeperPhone: response.data.user_phone,
            shopkeeperName: response.data.user_name,
          }
        });
      } else {
        console.log('查询店主失败');
        this.setState({showNoShopkeeperModal: true})
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
    this.fetchChannel();
    this.fetchConstantSettingEnumField()
  }

  async fetchChannel() {
    try {
      const response = await this.props.fetchChannelAll({});
      this.setState({
        isLoading: false,
      });
    } catch(e) {
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

  handleNewChannelClick() {
    this.setState({addChannelModal: true});
  }

  renderNav() {
    return (
      <div class="pull-right">
        <Button color="primary" onClick={() => {this.handleNewChannelClick()}}>新增渠道</Button>
      </div>
    )
  }

  renderList() {
    const { channels: { isFetching, list, current_page } } = this.props.channel;
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
                  <Button size="sm" cssModule={{ margin: 10}} color="primary">冻结</Button>
                  <Button size="sm" color="primary" onClick={() => {this.channelToggle()}}>编辑</Button>
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

  renderNoShopkeeper () {
    const { showNoShopkeeperModal } = this.state;

    return (
      <Modal isOpen={showNoShopkeeperModal} className='modal-no-shoppkeeper modal-danger'>
        <ModalHeader>提示</ModalHeader>
        <ModalBody>
          查询店主失败
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.setState({showNoShopkeeperModal: false})}>确定</Button>
        </ModalFooter>
      </Modal>
    )
  }

  renderAddChannel() {
    const { addChannelModal, queryShopkeeperDisabled, addChannel, saveDisabled, enumField} = this.state;
    const { channelCategory, channelSource, channelUserRoleType } = this.state.enumField;

    return (
      <div>
      <Modal isOpen={addChannelModal} className='channel-modal'>
        <ModalHeader>新增渠道人员</ModalHeader>
        <ModalBody>
          <Container>
            <Form>
              <FormGroup row>
                <Label sm={3}>店主手机号</Label>
                <Col sm={9}>
                  <InputGroup>
                    <Input required
                      placeholder="输入店主手机号"
                      value={addChannel.shopkeeperPhone}
                      onChange={(e) => {
                        this.setState({ addChannel: {...this.state.addChannel, shopkeeperPhone: e.target.value}})
                      }} />
                    <Button disabled={queryShopkeeperDisabled} onClick={() => this.queryShopkeeper()} color="primary">查询</Button>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>店主姓名</Label>
                <Col sm={9}>
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
              <FormGroup row>
                <Label sm={3}>密码</Label>
                <Col sm={9}>
                  <InputGroup>
                    <Input
                      value={addChannel.password}
                      placeholder="输入店主姓名"
                      onChange={(e) => {
                        this.setState({ addChannel: {...this.state.addChannel, password: e.target.value}})
                      }}/>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>渠道名称</Label>
                <Col sm={9}>
                  <InputGroup>
                    <Input
                      value={addChannel.name}
                      placeholder="输入渠道名称"
                      onChange={(e) => {
                        this.setState({ addChannel: {...this.state.addChannel, name: e.target.value}})
                      }}/>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>渠道类型</Label>
                <Col xs={9}>
                  <Input
                    type="select"
                    value={addChannel.channelType}
                    onChange={(e) => {
                      this.setState({ addChannel: {...this.state.addChannel, channelType: e.target.value}})
                    }}>

                    {
                      _.map(channelCategory, (value, key) => {
                        return (
                          <option value={key}>{value}</option>
                        )
                      })
                    }
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>渠道分类</Label>
                <Col xs={9}>
                  <Input
                    type="select"
                    name="select"
                    value={addChannel.source}
                    onChange={(e) => {
                      this.setState({ addChannel: {...this.state.addChannel, source: e.target.value}})
                    }}>
                    {
                      _.map(channelSource, (value, key) => {
                        return (
                          <option value={key}>{value}</option>
                        )
                      })
                    }
                  </Input>
                </Col>
              </FormGroup>
            </Form>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => {this.channelToggle()}}>取消</Button>
          <Button color="primary" disabled={saveDisabled} onClick={() => {this.saveChannel()}}>保存</Button>
        </ModalFooter>
      </Modal>
      </div>
    );
  }

  render() {
    return (
      <div className='channel-setting'>
        <Card>
          <CardBody>
            { this.renderNav() }
            { this.renderChannelList() }

            { this.renderAddChannel() }
            { this.renderNoShopkeeper() }
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default Channel;
