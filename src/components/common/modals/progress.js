import { Component } from "react";
import { Modal } from "react-bootstrap";

class ProgressModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <Modal show={this.props.showProgress} onHide={this.props.handleCloseProgress} centered>
            <Modal.Header closeButton>
                <Modal.Title>Purchace</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>Transaction in progress</div>
                    <div>Wait for the transaction to complete</div>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default ProgressModal