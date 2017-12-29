import React, {Component} from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Container, Table
} from 'reactstrap';

import Loading from 'components/Loading/'
import Nodata from 'components/Nodata/'
import DestroyChannel from './destroy_channel'
import ChannelRegionApi from 'api/channel_region';

class Channels extends Component {

  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      channel_region: {},
      channel_region_maps: [],
      destroyed: false
    }
  }

  async fetchDetail() {
    this.setState({ isLoading: true });

    try {
      const { channel_region: {id} } = this.state;
      const res = await ChannelRegionApi.instance().show({ id });

      if (Number(res.code) === 0) {
        this.setState({
          channel_region_maps: res.data.channel_region_maps,
          isLoading: false
        });
      } else {
        this.props.notificator.error({ text: '获取区域详情失败' });

        if (this.props.fail) this.props.fail(res);
      }
    } catch(e) {
      console.error(e);
      this.setState({ networkError: true });
    }
  }

  showModal(channel_region = {}) {
    this.setState({
      isOpen: true,
      destroyed: false,
      channel_region
    }, this.fetchDetail);
  }

  hideModal() {
    const { destroyed } = this.state;

    this.setState({ isOpen: false, destroyed: false });
    if (destroyed && this.props.callback) this.props.callback();
  }

  renderChannelTr(map) {
    const channel_user = map.channel_users[0] || {};
    const { channel } = map;

    return (
      <tr key={ map.id }>
        <th>{ channel.name }</th>
        <th>{ channel_user.name }</th>
        <th>{ channel_user.phone }</th>
        <th>
          <DestroyChannel
            notificator={this.props.notificator}
            channel_region_map={map}
            success={(data) => {
              this.setState({ destroyed: true }, this.fetchDetail);
            }}
          />
        </th>
      </tr>
    );
  }

  renderChannelTableTbody() {
    const { channel_region_maps, isLoading, networkError }  = this.state;

    if (isLoading) {
      return <Loading isLoading={isLoading} type='tr' th={{colSpan: 4}} />
    } else if (networkError) {
      return <Nodata isNodata={networkError} info="网络错误..." type='tr' th={{colSpan: 4}}  />
    } else if (!channel_region_maps.length) {
      return <Nodata isNodata={!channel_region_maps.length} type='tr' th={{colSpan: 4}}  />
    }

    return _.map(channel_region_maps, (map) => {
      return this.renderChannelTr(map);
    });
  }

  renderChannelTable() {
    return (
      <Table bordered size="sm">
        <thead>
          <tr>
            <th>渠道名称</th>
            <th>店主姓名</th>
            <th>店主手机号</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          { this.renderChannelTableTbody() }
        </tbody>
      </Table>
    );
  }

  render() {
    const { isOpen, channel_region } = this.state;

    return (
      <Modal isOpen={isOpen} className='modal-input'>
        <ModalHeader toggle={() => this.hideModal() }>{ channel_region.name } 的渠道列表</ModalHeader>
        <ModalBody className='modal-body-channels'>
          <Container>
            { this.renderChannelTable() }
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => this.hideModal() }>确定</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default Channels;
