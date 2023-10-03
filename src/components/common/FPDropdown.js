import { Component } from "react";
import { Dropdown } from "react-bootstrap";

class FPDropdown extends Component {
    constructor(props) {
        super(props)
    }
    /*componentDidMount(){
        if(this.props.isTransformIcon) {
            document.addEventListener('click', this.handleDocumnet)
        }
    }

    componentWillUnmount() {
        if(this.props.isTransformIcon) {
            document.removeEventListener('click', this.handleDocumnet)
        }
    }

    handleDocumnet(event) {
        const id = event.target.id
        this.rotateChevron(id)
    }

    rotateChevron(id) {
        const chevron = document.querySelector('[data-element="icon"]')
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
    }*/

    handleLogout() {
        this.props.emit.logout()
    }
    
    //rotateChevron = this.rotateChevron.bind(this)
    //handleDocumnet = this.handleDocumnet.bind(this)
    //handleLogout = this.handleLogout.bind(this)

    render() {
        const {label, children, icon} = this.props
        return(
                <Dropdown className="dropdown-profile">
                    <Dropdown.Toggle className="dropdown__toggle dropdown-profile__toggle" id="dropdown-basic">
                        <span id="dropdown-label" className="user__name">{label}</span>
                        <img className="dropdown__toggle-icon" data-element="icon" src={icon}></img>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdown__menu">
                        {children}
                    </Dropdown.Menu>
                </Dropdown>
        )
    }
}

export default FPDropdown