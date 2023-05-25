import { Component } from "react";
import { Modal } from "react-bootstrap";

class SuccessModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <Modal show={this.props.showSuccess} onHide={this.props.handleCloseSuccess} centered>
            <Modal.Header closeButton>
                <Modal.Title>Purchace</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>{this.props.successName}</div>
                    <div>{this.props.successText}</div>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default SuccessModal