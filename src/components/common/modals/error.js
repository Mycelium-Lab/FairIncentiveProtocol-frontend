import { Component } from "react";
import { Modal } from "react-bootstrap";
import attention from '../../../media/common/attention.svg'

class ErrorModal extends Component {
    constructor(props) {
        super(props)
    }

    entering() {
        const mint = document.getElementById('mint')
        const createUser = document.getElementById('createUser')
        const editUser = document.getElementById('editUser')
        const blackList = document.getElementById('blackList')
        const modal = mint?.parentElement || createUser?.parentElement 
        || editUser?.parentElement || blackList?.parentElement
        if(modal) {
            modal.style.zIndex = '1049'
        }
    }

    entered() {
        const mint = document.getElementById('mint')
        const createUser = document.getElementById('createUser')
        const editUser = document.getElementById('editUser')
        const blackList = document.getElementById('blackList')
        const modal = mint?.parentElement || createUser?.parentElement 
        || editUser?.parentElement || blackList?.parentElement
        if(modal) {
            modal.style.zIndex = '1050'
        }
    }

    entering = this.entering.bind(this)
    entered = this.entered.bind(this)

    render() {
        return <Modal onEntering={this.entering} onEntered={this.entered} show={this.props.showError} onHide={this.props.handleCloseError} centered>
             <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                 Error
            </Modal.Header>
            <Modal.Body>
                <div className="confirm__body">
                <img src={attention}></img>
                <div>
                    <div className="confirm__name">{this.props.errorName}</div>
                    <div className="confirm__text_red confirm__text">{this.props.errorText}</div>
                </div>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default ErrorModal