import { Component } from "react";
import { Modal } from "react-bootstrap";
import success from '../../../media/common/success.svg'

class UpdateModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <Modal show={this.props.showSuccess} onHide={this.props.handleCloseSuccess} centered>
             <Modal.Header  className="modal-newuser__title modal-title" closeButton>
             {this.props.successTitle}
            </Modal.Header>
            <Modal.Body>
                <div className="confirm__body">
                    <img src={success}></img>
                    <div className="confirm__content">
                        <div className="confirm__name">{this.props.successName}</div>
                        <div className="confirm__text">{this.props.successText}</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default UpdateModal