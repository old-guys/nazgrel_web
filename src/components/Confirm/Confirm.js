import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Confirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: props.visible
    };
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  onButtonClick() {
    this.setState({
      isOpened: true
    });
  }

  onClose(event) {
    event.stopPropagation();
    this.setState({
      isOpened: false
    });

    if (typeof this.props.onClose == 'function') {
      this.props.onClose();
    }
  }

  onConfirm(event) {
    event.stopPropagation();
    this.setState({
      isOpened: false
    });
    this.props.onConfirm();
  }

  render() {
    let cancelButton = this.props.showCancelButton ? (
      <Button bsstyle={this.props.cancelBSStyle} color={this.props.cancelBSStyle} size={this.props.cancelSize} onClick={this.onClose}>
        {this.props.cancelText}
      </Button>
    ) : null;

    let modal = (
      <Modal isOpen={this.state.isOpened} onHide={this.onClose}>
        <ModalHeader>{this.props.title}</ModalHeader>
        <ModalBody>{this.props.body}</ModalBody>
        <ModalFooter>
          {cancelButton}
          <Button bsstyle={this.props.confirmBSStyle} size={this.props.confirmSize} onClick={this.onConfirm}>
            {this.props.confirmText}
          </Button>
        </ModalFooter>
      </Modal>
    );

    return (
      <Button bsstyle={this.props.buttonBSStyle} color={this.props.buttonBSStyle} size={this.props.buttonSize} onClick={this.onButtonClick} style={this.props.style}>
        {this.props.buttonText}
        {modal}
      </Button>
    )
  }
}

Confirm.propTypes = {
  body: PropTypes.node.isRequired,
  buttonText: PropTypes.node,
  buttonBSStyle: PropTypes.string,
  buttonSize: PropTypes.string,
  cancelText: PropTypes.node,
  cancelBSStyle: PropTypes.string,
  cancelSize: PropTypes.string,
  confirmBSStyle: PropTypes.string,
  confirmSize: PropTypes.string,
  confirmText: PropTypes.node,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  showCancelButton: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
  visible: PropTypes.bool
};

Confirm.defaultProps = {
  cancelText: '取消',
  cancelBSStyle: "default",
  cancelSize: "sm",
  confirmText: 'Confirm',
  confirmBSStyle: 'primary',
  confirmSize: 'sm',
  buttonBSStyle: "danger",
  buttonSize: "sm",
  showCancelButton: true
};

export { Confirm };
export default Confirm;
