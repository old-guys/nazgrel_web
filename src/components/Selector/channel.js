import Selector from './selector'
import ChannelApi from 'api/channel';

export default class ChannelSelector extends Selector {
  constructor(props) {
    super(props);

    this.name = props.name || "channel_ids";
    this.placeholder = props.placeholder || "选择渠道";
    this.selectRef = "channelSelect";
  }

  fetchData(params = {}) {
    return ChannelApi.instance().index(params);
  }
}
