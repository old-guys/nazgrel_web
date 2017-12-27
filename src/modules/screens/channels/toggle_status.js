import React, {Component} from 'react';
import { ChannelApi } from '../../api';
import { Confirm } from '../../../components/Confirm/';

class ToggleStatus extends Component {

  constructor (props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
  }

  async handleSave() {
    const { channel } = this.props;
    const isLocked = channel.status === 'locked';
    const text = isLocked ? '激活' : '冻结'
    const status = isLocked ? 'normal' : 'locked';
    const opts = {
      id: channel.id,
      status
    }

    try {
      const res = await ChannelApi.instance().update({ channel: opts });
      if (Number(res.code) === 0) {
        this.props.notificator.success({ text: `${text}渠道成功` });

        if (this.props.success) this.props.success(res.data);
      } else {
        this.props.notificator.error({ text: `${text}渠道失败: ${res.message}` });
      }
    } catch(e) {
      console.error(e);
      this.setState({ networkError: true });
    }
  }

  render() {
    const { channel } = this.props;
    const isLocked = channel.status === 'locked';
    const buttonText = isLocked ? '激活' : '冻结';
    const buttonBSStyle = isLocked? 'warning' : 'danger'

    return (
      <Confirm
        buttonText={buttonText}
        buttonBSStyle={buttonBSStyle}
        buttonSize="sm"
        onConfirm={ this.handleSave }
        body={`你确定要${buttonText}渠道吗?`}
        confirmText="确定"
        title="提示"
      />
    );
  }
}

export default ToggleStatus;
