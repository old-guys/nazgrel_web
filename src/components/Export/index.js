import _ from 'lodash';
import React, {Component} from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Container
} from 'reactstrap';
import { Auth } from 'services'

class Export extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    }

    this.initElements();
    this.initVariables();
  }

  initElements() {
    this.hideExportModal = this.hideExportModal.bind(this);

    this.hideCloseModal = this.hideCloseModal.bind(this);
    this.confirmCloseModal = this.confirmCloseModal.bind(this);

    this.hideDeleteModal = this.hideDeleteModal.bind(this);
    this.confirmDeleteModal = this.confirmDeleteModal.bind(this);

    this.downloadFile = this.downloadFile.bind(this);
  }

  initVariables() {
    this.service = null;
    this.action = null;
    this.page = 1;
    this.jid = null;
    this.asyncClientId = null;

    this.task = false;
    this.status = null;

    this.startTime = 1;
    this.endTime = 0;

    this.ascProgress = 0;
    this.currentProgress = 0;
    this.gapProgress = 0;
    this.endProgress = 0;

    this.fileSize = 0;
    this.chunkSize = 50 * 1024;
    this.filePath = null;

    this.timeOuts = [];
  }

  camelize(str) {
    return str.replace(/(_[a-z])/g, ($1) => {
      return $1.toUpperCase().replace('_', '');
    });
  }

  // 任务是否完成
  isComplete() {
    return this.isSuccess() || this.isFailure() || this.task;
  }

  // 任务是否成功
  isSuccess() {
    return this.status === 'success';
  }

  // 任务是否失败
  isFailure() {
    return this.status === "failure";
  }

  // faye推送的信息是否为当前任务的信息
  isCurretAsyncModal(data) {
    return this.asyncClientId === data.async_client_id;
  }

  // 验证文件来源的正确性
  isValidFile() {
    if (!this.filePath) return;

    return _.includes(this.filePath.split('/'), this.asyncClientId);
  }

  // 设置当前任务为完成
  setTaskComplete() {
    this.task = true;
  }

  // 计算任务当前进度
  increaseProgress() {
    if (this.startTime > this.endTime) return;

    const progress = this.currentProgress + this.startTime * this.ascProgress;
    if (progress < this.endProgress) {
      this.updateProgress(progress);
      const self = this;

      setTimeout(() => {
        this.increaseProgress()
      }, 10000);
      this.startTime++;
    } else if(this.endProgress >= this.currentProgress) {
      this.updateProgress(this.endProgress);
    }
  }

  // 清除累积的setTimeout
  clearTimeOuts() {
    _.each(this.timeOuts, (i, e) =>
      clearTimeout(e)
    );
    this.timeOuts = [];
  }

  // 更新当前任务相关数据
  updateVariables(data) {
    if (_.hasIn(data, 'service')) this.service = data.service;
    if (_.hasIn(data, 'action')) this.action = data.action;
    if (_.hasIn(data, 'async_client_id')) this.asyncClientId = data.async_client_id;
    if (_.hasIn(data, 'page')) this.page = data.page;

    if (_.hasIn(data, 'status')) this.status = data.status;

    if (_.hasIn(data, 'progress')) this.currentProgress = data.progress;
    if (_.hasIn(data, 'gap_progress')) this.gapProgress = data.gap_progress;

    if (_.hasIn(data, 'file_size')) this.fileSize = data.file_size;
    if (_.hasIn(data, 'qiniu_file_path')) this.filePath = data.qiniu_file_path;

    switch (data.status) {
      case 'start':
      case 'write':
        this.endTime = 60;
        this.endProgress = this.currentProgress + this.gapProgress;
        this.ascProgress = this.gapProgress / this.endTime;
        break;
      case 'before_upload':
        this.endTime = this.fileSize > this.chunkSize ? Math.ceil(this.fileSize / this.chunkSize) : 10;
        this.endProgress = this.currentProgress + this.gapProgress;
        this.ascProgress = this.gapProgress / this.endTime;
        break;
    }

    if (this.isComplete()) this.setTaskComplete();
  }

  // 页面百分比进度更新
  updateProgress(progress) {
    if (this.isComplete()) return;

    progress = (progress || this.currentProgress).toFixed(2);
    this.exportModal.find('p.success').hide();
    this.exportModal.find('p.loading').show();
    this.exportModal.find('p.fz14').html(`
      正在导出${this.props.actionName}，导出进度 <span class="export-progress" style="color: red;">${progress}%</span>，请不要关闭当前窗口或刷新页面...
    `);
  }


  // 任务成功后的操作
  success() {
    if (!this.isValidFile()) return;

    this.downloadFile();

    this.exportModal.find('p.success').show();
    this.exportModal.find('p.loading').hide();
    this.exportModal.find('p.fz14').html(`
      导出${this.props.actionName}数据任务成功，请<a class="download-file" href="javascript:;" data-href="${this.filePath}">点击下载文件</a>
    `);
  }

  // 任务失败后的操作
  failure() {
    this.exportModal.find('p.success').hide();
    this.exportModal.find('p.loading').hide();
    this.exportModal.find('p.fz14').html('导出工作报告数据任务失败，请重新导出。');
  }

  updateView(data) {
    console.log(data);

    this.updateVariables(data);
    this.clearTimeOuts();
    this.updateProgress();

    switch (data.status) {
      case 'start':
      case 'write':
      case 'before_upload':
        const self = this;
        this.timeOuts.push(
          setTimeout(() =>
            self.increaseProgress()
          , 1000)
        );
        break;
      case 'failure':
      case 'upload_failure':
      case 'success':
        eval(`this.${this.camelize(data.status)}()`);
        break;
    }
  }

  downloadFile(e) {
    const filePath = e ? e.currentTarget.getAttribute('data-href') : this.filePath;

    this.refs.download.src = filePath;
  }

  subscribeToFaye(callback) {
    if (this.isSubscribeToFaye) return callback();

    this.isSubscribeToFaye = true;

    const user = (new Auth()).currentUser();
    const channel = user.export_channel || `/export/file/${user.id}`;
    const _function = () => {
      window.fayeClient.subscribe(channel, (data) => {
        if (this.isCurretAsyncModal(data)) {
          this.updateView(data);
        }
      });

      callback();
    }

    this.withFayeClient(_function.bind(this));
  }

  withFayeClient(callback) {
    const config = process.platformConfig;
    const init_faye = () => {
      if (!window.initFaye) {
        window.initFaye = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          document.body.appendChild(script);

          script.onload = resolve;
          script.onerror = reject;
          script.async = true;
          script.src = `${config.fayeHost}faye/client.js`;
        }).then(() => {
          window.fayeClient = new Faye.Client(`${config.fayeHost}faye`);
        });
      }

      window.initFaye.then(callback);
    }

    setTimeout(init_faye, 400);
  }

  showExportModal(callback) {
    this.subscribeToFaye(callback);
    this.clearTimeOuts();
    this.initVariables();

    this.setState({
      isOpenExport: true,
      isOpenClose: false,
      isOpenDelete: false
    });

    setTimeout(() => {
      const self = this;
      this.exportModal = $("#export-modal");
      this.exportModal.on('click', 'a.download-file', (e) => {
        this.downloadFile(e)
      });
    }, 0);
  }

  hideExportModal() {
    if (this.isComplete()) {
      this.setState({ isOpenExport: false });
      return;
    }

    if (this.status) this.setState({ isOpenClose: true });
    else this.setState({ isOpenDelete: true });
  }

  hideCloseModal() {
    this.setState({ isOpenClose: false });
  }

  confirmCloseModal() {
    this.initVariables();

    this.setState({
      isOpenExport: false,
      isOpenClose: false
    });
  }

  hideDeleteModal() {
    this.setState({ isOpenDelete: false });
  }

  confirmDeleteModal() {
    this.initVariables();

    this.setState({
      isOpenExport: false,
      isOpenDelete: false
    });
  }

  render() {
    const { isOpenExport, isOpenClose, isOpenDelete } = this.state;
    const { actionName } = this.props;

    return (
      <div ref='export'>
        <Modal isOpen={isOpenExport} id="export-modal" style={{'max-width': '550px'}}>
          <ModalHeader toggle={this.hideExportModal}>导出 { actionName }</ModalHeader>
          <ModalBody>
            <Container>
              <div className="text-center padv20">
                <p className="success" style={{'display': 'none'}}><i className="fa fa-check-circle-o fz30 text-primary"></i></p>
                <p className="loading" style={{'display': 'none'}}><i className="fa fa-spinner fa-spin fz30"></i></p>
                <p className="fz14">
                  导出{actionName}数据任务正在加入队列任务中，请耐心等待...
                </p>
              </div>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.hideExportModal}>取消</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={isOpenClose} id="open-modal">
          <ModalHeader toggle={this.hideCloseModal}>提示</ModalHeader>
          <ModalBody>
            <Container>
              <div className="text-center">
                <p className='fz14'>后台仍执行导出动作，导出后不处理此数据，是否确定关闭当前窗口？</p>
              </div>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.confirmCloseModal}>确定</Button>
            <Button color="secondary" onClick={this.hideCloseModal}>取消</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={isOpenDelete}>
          <ModalHeader toggle={this.hideDeleteModal}>提示</ModalHeader>
          <ModalBody>
            <Container>
              <div className="text-center padv20">
                <p className="fz14">关闭当前窗口任务将被取消，是否确定关闭当前窗口？</p>
              </div>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.confirmDeleteModal}>确定</Button>
            <Button color="secondary" onClick={this.hideDeleteModal}>取消</Button>
          </ModalFooter>
        </Modal>

        <iframe ref="download" style={{'display': 'none'}}></iframe>
      </div>
    );
  }
}

export default Export;
