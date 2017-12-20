import React, {Component} from 'react';
import DemoApi from '../../api/demo';
import { Confirm } from '../../../components/Confirm/';

class DestroyDemo extends Component {

  constructor (props) {
    super(props);

    this.handleDestroy = this.handleDestroy.bind(this);
  }

  async handleDestroy() {
    const { demo } = this.props;

    try {
      const res = await DemoApi.instance().destroy({ demo });
      if (Number(res.code) === 0) {
        this.props.notificator.success({ text: '删除demo成功' });

        if (this.props.success) this.props.success(res.data);
      } else {
        this.props.notificator.error({ text: '删除demo成功' });
      }
    } catch(e) {
      this.setState({ networkError: true });
    }
  }

  render() {
    return (
      <Confirm
        buttonText="删除"
        buttonBSStyle="warning"
        buttonSize="sm"
        onConfirm={ this.handleDestroy }
        body="你确定要删除demo吗?"
        confirmText="确定"
        title="提示"
      />
    );
  }
}

export default DestroyDemo;
