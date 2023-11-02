import { Component } from "react";
import { Modal } from "react-bootstrap";
import success from '../../../media/common/success.svg'

class SuccessModal extends Component {
    constructor(props) {
        super(props)
    }

    entering() {
        const mint = document.getElementById('mint')
        const createUser = document.getElementById('createUser')
        const editUser = document.getElementById('editUser')
        const blackList = document.getElementById('blackList')
        const rewardFromUser = document.getElementById('rewardFromUser')
        const rewardFromReward = document.getElementById('rewardFromReward')
        const rewarding = document.getElementById('rewarding')
        const modal = mint?.parentElement || createUser?.parentElement 
        || editUser?.parentElement || blackList?.parentElement || rewardFromUser?.parentElement
        || rewardFromReward?.parentElement || rewarding?.parentElement
        if(modal) {
            modal.style.zIndex = '1049'
        }
    }

    entered() {
        const mint = document.getElementById('mint')
        const createUser = document.getElementById('createUser')
        const editUser = document.getElementById('editUser')
        const blackList = document.getElementById('blackList')
        const rewardFromUser = document.getElementById('rewardFromUser')
        const rewardFromReward = document.getElementById('rewardFromReward')
        const rewarding = document.getElementById('rewarding')
        const modal = mint?.parentElement || createUser?.parentElement 
        || editUser?.parentElement || blackList?.parentElement || rewardFromUser?.parentElement
        || rewardFromReward?.parentElement || rewarding?.parentElement
        if(modal) {
            modal.style.zIndex = '1050'
        }
    }

    entering = this.entering.bind(this)
    entered = this.entered.bind(this)

    render() {
        return <Modal onEntering={this.entering} onEntered={this.entered} show={this.props.showSuccess} onHide={this.props.handleCloseSuccess} centered>
             <Modal.Header  className="modal-newuser__title modal-title" closeButton>
                 {this.props.successTitle}
            </Modal.Header>
            <Modal.Body>
                <div className="confirm__body">
                    <img src={success}></img>
                    <div>
                        <div className="confirm__name">{this.props.successName}</div>
                        <div className="confirm__text">{this.props.successText}</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default SuccessModal