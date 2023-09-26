import { Component } from "react";
import { Modal } from "react-bootstrap";

class ErrorModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <Modal show={this.props.showError} onHide={this.props.handleCloseError} centered>
            <Modal.Header closeButton>
                <Modal.Title>Purchace</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>Error</div>
                    <div>{this.props.errorText}</div>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default ErrorModal