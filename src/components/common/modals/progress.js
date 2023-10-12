import { Component } from "react";
import { Modal } from "react-bootstrap";
import loader from '../../../media/common/loader.svg'

class ProgressModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <Modal show={this.props.showProgress} onHide={this.props.handleCloseProgress} centered>
             <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                 Purchace
            </Modal.Header>
            <Modal.Body>
                <div className="confirm__body">
                <img className="modal__loader" src={loader}></img>
                <div>
                    <div className="confirm__name">Transaction in progress</div>
                    <div className="confirm__text">Wait for the transaction to complete</div>
                </div>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default ProgressModal