import { Component } from "react";
import { Modal } from "react-bootstrap";
import loader from '../../../media/common/loader.svg'
class ConfirmModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <Modal show={this.props.showConfirm} onHide={this.props.handleCloseConfirm} centered>
             <Modal.Header  className="modal-newuser__title modal-title" closeButton>
             {this.props.confirmTitle}
            </Modal.Header>
            <Modal.Body>
                <div className="confirm__body">
                    <img className="modal__loader" src={loader}></img>
                    <div>
                        <div className="confirm__name">{this.props.confirmName}</div>
                        <div className="confirm__text">{this.props.confirmText}</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default ConfirmModal