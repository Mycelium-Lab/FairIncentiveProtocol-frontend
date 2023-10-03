import { Component } from "react";
import { Modal } from "react-bootstrap";

class ErrorModal extends Component {
    constructor(props) {
        super(props)
    }

    entering() {
        const mint = document.getElementById('mint')
        const modal = mint.parentElement
        modal.style.zIndex = '1049'
        console.log('test', mint.parentElement)
    }

    entering = this.entering.bind(this)

    render() {
        return <Modal onEntering={this.entering} show={this.props.showError} onHide={this.props.handleCloseError} centered>
             <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                 Purchace
            </Modal.Header>
            <Modal.Body>
                <div className="confirm__body">
                    <div className="confirm__name">Error</div>
                    <div className="confirm__text">{this.props.errorText}</div>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default ErrorModal