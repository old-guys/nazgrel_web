import React, {Component} from 'react';
import { ChannelRegionApi } from '../../api';
import { Confirm } from '../../../components/Confirm/';

class DestroyChannel extends Component {

  constructor (props) {
    super(props);

    this.handleDeleteChannel = this.handleDeleteChannel.bind(this);
  }

  async handleDeleteChannel() {
    const { channel_region_map } = this.props;

    try {
      const res = await ChannelRegionApi.instance().deleteChannel({ channel_region_map });

      if (Number(res.code) === 0) {
        this.props.notificator.success({ text: '删除渠道成功' });

        if (this.props.success) this.props.success(res.data);
      } else {
        this.props.notificator.error({ text: '删除渠道失败' });
      }
    } catch(e) {
      console.error(e);
      this.setState({ networkError: true });
    }
  }

  render() {
    const { channel_region_map } = this.props;

    return (
      <Confirm
        buttonText="删除"
        buttonBSStyle="warning"
        buttonSize="sm"
        onConfirm={ this.handleDeleteChannel }
        body="你确定要删除渠道吗?"
        confirmText="确定"
        title="提示"
      />
    );
  }
}

export default DestroyChannel;
