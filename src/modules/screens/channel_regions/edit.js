import React, {Component} from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Container
} from 'reactstrap';
import { AvForm, AvGroup, AvField, AvInput, AvFeedback } from 'availity-reactstrap-validation';

import ChannelRegionApi from 'api/channel_region';
import ChannelSelector from 'components/Selector/channel'

class EditChannelRegion extends Component {

  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      channel_region: {},
      saveBtnDisabled: false,
      cancelBtnDisabled: false
    };

    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async fetchDetail() {
    this.setState({ saveBtnDisabled: true });

    try {
      const { id } = this.state;
      const res = await ChannelRegionApi.instance().show({ id });

      if (Number(res.code) === 0) {
        let channel_region = res.data;

        channel_region.channel_ids = _.map(channel_region.channel_region_maps, 'channel_id');
        channel_region.selectedOptions = _.map(channel_region.channel_region_maps, (map) => {
          return { id: map.channel_id, name: map.channel_name };
        });

        this.setState({ channel_region });
      } else {
        this.props.notificator.error({ text: '获取区域详情失败' });

        if (this.props.fail) this.props.fail(res);
      }
    } catch(e) {
      console.error(e);
      this.setState({ networkError: true });
    }

    this.setState({ saveBtnDisabled: false });
  }

  showModal(channel_region = {}) {
    this.setState({
      isOpen: true,
      channel_region: {},
      id: channel_region.id,
    }, this.fetchDetail);
  }

  hideModal() {
    this.setState({ isOpen: false });
  }

  async handleSave() {
    this.setState({
      saveBtnDisabled: true,
      cancelBtnDisabled: true
    });

    try {
      const { channel_region } = this.state;
      const opts = _.pick(channel_region, ['id', 'name', 'channel_ids']);
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

    this.setState({
      saveBtnDisabled: false,
      cancelBtnDisabled: false
    });
  }

  handleSubmit(event, errors, values) {
    if (_.isEmpty(errors)) this.handleSave();
  }

  render() {
    const { isOpen, channel_region, saveBtnDisabled, cancelBtnDisabled } = this.state;
    const channel_user = channel_region.channel_user || {};

    return (
      <Modal isOpen={isOpen} className='modal-input'>
        <AvForm onSubmit={this.handleSubmit} >
          { cancelBtnDisabled && <ModalHeader>编辑区域</ModalHeader> }
          { !cancelBtnDisabled && <ModalHeader toggle={this.hideModal}>编辑区域</ModalHeader> }
          <ModalBody>
            <Container>
              <AvField
                name="name"
                value={channel_region.name}
                label="区域名称"
                type="text"
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
                    async={true}
                    onChange={(values) => {
                      channel_region.channel_ids = _.map(values, 'id');
                      this.setState({ channel_region });
                    }}
                    filters={
                      [
                        { name: 'status', operator: 'eq', query: 0 }
                      ]
                    }
                  />
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.hideModal} disabled={cancelBtnDisabled}>取消</Button>
            <Button color="primary" disabled={saveBtnDisabled}>保存</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }
}

export default EditChannelRegion;
