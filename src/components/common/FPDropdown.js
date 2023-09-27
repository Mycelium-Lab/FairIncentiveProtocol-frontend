import { Component } from "react";
import chevron from '../../media/common/chevron.svg'
import user from '../../media/common/user.svg'
import { Dropdown } from "react-bootstrap";

class FPDropdown extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount(){
        document.addEventListener('click', this.handleDocumnet)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumnet)
    }

    handleDocumnet(event) {
        const id = event.target.id
        this.rotateChevron(id)
    }

    rotateChevron(id) {
        const chevron = document.querySelector('#chevron-icon')
        const value = parseInt(chevron.style.transform.match(/\d+/))

        if(id !== 'dropdown-label' && id !== 'chevron-icon' && id !== 'dropdown-basic' && !value) {
            return
        }

        if(value === 180) {
            chevron.style.transform = `rotate(0deg)`
        }
        else {
            chevron.style.transform = `rotate(180deg)`
        }
    }

    handleLogout() {
        this.props.emit.logout()
    }
    
    rotateChevron = this.rotateChevron.bind(this)
    handleDocumnet = this.handleDocumnet.bind(this)
    handleLogout = this.handleLogout.bind(this)

    render() {
        const {label} = this.props
        return(
                <Dropdown className="dropdown-profile">

                    <Dropdown.Toggle className="dropdown__toggle dropdown-profile__toggle" id="dropdown-basic">
                        <span id="dropdown-label" className="user__name">{label}</span>
                        <img className="dropdown__toggle-icon" id="chevron-icon" src={chevron}></img>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdown__menu">
                        <Dropdown.Item className="dropdown__menu-item_profile dropdown__menu-iten">
                            <img src={user}></img>
                            <div className="dropdown__menu-item_profile-info">
                                <span className="dropdown__menu-item_profile-username">{label}</span>
                                <span className="dropdown__menu-item_profile-status">Admin</span>
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item className="dropdown__menu-item">My Profile</Dropdown.Item>
                        <Dropdown.Item className="dropdown__menu-item">Settings</Dropdown.Item>
                        <Dropdown.Item className="dropdown__menu-item_logout dropdown__menu-item" onClick={this.handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
        )
    }
}

export default FPDropdown