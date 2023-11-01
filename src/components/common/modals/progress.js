import { Component } from "react";
import { Modal } from "react-bootstrap";
import loader from '../../../media/common/loader.svg'

class ProgressModal extends Component {
    constructor(props) {
        super(props)
    }

     entering() {
        const mint = document.getElementById('mint')
        const createUser = document.getElementById('createUser')
        const editUser = document.getElementById('editUser')
        const modal = mint?.parentElement || createUser?.parentElement || editUser?.parentElement
        if(modal) {
            modal.style.zIndex = '1049'
        }
    }

    entered() {
        const mint = document.getElementById('mint')
        const createUser = document.getElementById('createUser')
        const editUser = document.getElementById('editUser')
        const modal = mint?.parentElement || createUser?.parentElement || editUser?.parentElement
        if(modal) {
            modal.style.zIndex = '1050'
        }
    }

    entering = this.entering.bind(this)
    entered = this.entered.bind(this)

    render() {
        return <Modal onEntering={this.entering} onEntered={this.entered} show={this.props.showProgress} onHide={this.props.handleCloseProgress} centered>
             <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                {this.props.progressTitle ? this.props.progressTitle : 'Progress'}
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