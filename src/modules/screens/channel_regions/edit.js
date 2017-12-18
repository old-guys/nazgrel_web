import React, {Component} from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Container
} from 'reactstrap';
import { AvForm, AvGroup, AvField, AvInput, AvFeedback } from 'availity-reactstrap-validation';

import { ChannelRegionApi } from '../../api';
import ChannelSelector from '../../../components/Selector/channel'

class EditChannelRegion extends Component {

  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      channel_region: props.channel_region
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModal(channel_region = {}) {
    this.setState({ channel_region, isOpen: true });
  }

  hideModal() {
    this.setState({ isOpen: false });
  }

  async handleSave() {
    const { channel_region } = this.state;
    const opts = _.pick(channel_region, ['id', 'name', 'channel_ids']);

    try {
      const res = await ChannelRegionApi.instance().update({ channel_region: opts });

      if (Number(res.code) === 0) {
        this.props.notificator.success({ text: '保存区域成功' });
        this.setState({ isOpen: false });

        if (this.props.success) this.props.success(res.data);
      } else {
        this.props.notificator.error({ text: `保存渠道失败:${res.message}` });

        if (this.props.fail) this.props.fail(res);
      }
    } catch(e) {
      console.error(e);
      this.setState({ networkError: true });
    }
  }

  handleSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.handleSave();
  }

  render() {
    const { isOpen, channel_region } = this.state;
    const channel_user = channel_region.channel_user || {};

    return (
      <Modal isOpen={isOpen} className='modal-input'>
        <AvForm onSubmit={this.handleSubmit} >
          <ModalHeader>编辑区域</ModalHeader>
          <ModalBody>
            <Container>
              <AvField name="name"
                value={channel_region.name}
                label="区域名称" type="text"
                placeholder="输入区域名称"
                grid={{md: 9}}
                onChange={(e) => {
                  channel_region.name = e.target.value;
                  this.setState({ channel_region });
                }}
                required
                validate={{pattern: { value: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[A-Za-z0-9])*$/ }}}
                errorMessage={{required: '输入区域名称', pattern: '区域名称只支持中文、英文、数字'}}
              />
              <Row>
                <Col xs='3'>选择渠道</Col>
                <Col xs='9'>
                  <ChannelSelector
                    multi={true}
                    value={channel_region.selectedOptions}
                    clearable={false}
                    searchable={false}
                    onChange={(values) => {
                      channel_region.channel_ids = _.map(values, 'id');
                      this.setState({ channel_region });
                    }}
                  />
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.hideModal() }>取消</Button>
            <Button color="primary">保存</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }
}

export default EditChannelRegion;
