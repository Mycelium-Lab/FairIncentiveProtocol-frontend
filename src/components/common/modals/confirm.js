import { Component } from "react";
import { Modal } from "react-bootstrap";

class ConfirmModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <Modal show={this.props.showConfirm} onHide={this.props.handleCloseConfirm} centered>
            <Modal.Header closeButton>
                <Modal.Title>Purchace</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>{this.props.confirmName}</div>
                    <div>{this.props.confirmText}</div>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default ConfirmModal