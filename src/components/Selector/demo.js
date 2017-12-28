import Selector from './selector'
// import { ChannelApi } from '../../modules/api';
import DemoApi from 'api/demo';

export default class DemoSelector extends Selector {
  constructor(props) {
    super(props);

    this.name = props.name || "demo_ids";
    this.placeholder = props.placeholder || "选择demo";
    this.selectRef = "demoSelect";
  }

  fetchData(params = {}) {
    return DemoApi.instance().index(params);
  }
}
