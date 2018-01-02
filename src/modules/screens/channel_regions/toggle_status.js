import React, {Component} from 'react';
import ChannelRegionApi from 'api/channel_region';
import { Confirm } from 'components/Confirm/';

class ToggleStatus extends Component {

  constructor (props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
  }

  async handleSave() {
    const { channel_region } = this.props;
    const isLocked = channel_region.status === 'locked';
    const text = isLocked ? '激活' : '冻结'
    const status = isLocked ? 'normal' : 'locked';
    const opts = {
      id: channel_region.id,
      status
    }

    try {
      const res = await ChannelRegionApi.instance().update({ channel_region: opts });
      if (Number(res.code) === 0) {
        this.props.notificator.success({ text: `${text}区域成功` });

        if (this.props.success) this.props.success(res.data);
      } else {
        this.props.notificator.error({ text: `${text}区域失败` });
      }
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  render() {
    const { channel_region } = this.props;
    const isLocked = channel_region.status === 'locked';
    const buttonText = isLocked ? '激活' : '冻结';
    const buttonBSStyle = isLocked? 'warning' : 'danger';

    return (
      <Confirm
        buttonText={buttonText}
        buttonBSStyle={buttonBSStyle}
        buttonSize="sm"
        onConfirm={ this.handleSave }
        body={`你确定要${buttonText}大区吗?`}
        confirmText="确定"
        title="提示"
      />
    );
  }
}

export default ToggleStatus;
