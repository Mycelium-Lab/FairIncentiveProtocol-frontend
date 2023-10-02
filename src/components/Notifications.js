import React, { Component } from "react";
import defaultUser from '../media/notifications/default.png'
import mock_1 from '../media/notifications/mock_1.png'
import mock_2 from '../media/notifications/mock_2.png'
import mock_3 from '../media/notifications/mock_3.png'

class Notifications extends Component {
    constructor(props) {
        super(props)
    }
        
    render() {
        return (
            <>
             <div className="title-header">
                <h3 className="menu__title">Notifications</h3>
             </div>
              
                <ul className="unlist">
                    <li className="notification__item">
                        <img src={defaultUser}></img>
                        <div className="notification__item-desc">
                            <p className="notification__item-message"><span className="notification__item-message_semimedium notification__item-message">Elwis Mathew</span> added a new product <span className="notification__item-message_semimedium notification__item-message">Redmi Pro 7 Mobile</span></p>
                            <span className="notification__item-time">4 mins ago</span>
                        </div>
                    </li>
                    <li className="notification__item">
                    <img src={mock_1}></img>
                        <div className="notification__item-desc">
                            <p className="notification__item-message"><span className="notification__item-message_semimedium notification__item-message">Elwis Mathew</span> added a new product <span className="notification__item-message_semimedium notification__item-message">Redmi Pro 7 Mobile</span></p>
                            <span className="notification__item-time">4 mins ago</span>
                        </div>
                    </li>
                    <li className="notification__item">
                    <img src={mock_2}></img>
                        <div className="notification__item-desc">
                            <p className="notification__item-message"><span className="notification__item-message_semimedium notification__item-message">Elwis Mathew</span> added a new product <span className="notification__item-message_semimedium notification__item-message">Redmi Pro 7 Mobile</span></p>
                            <span className="notification__item-time">4 mins ago</span>
                        </div>
                    </li>
                    <li className="notification__item">
                    <img src={mock_3}></img>
                        <div className="notification__item-desc">
                            <p className="notification__item-message"><span className="notification__item-message_semimedium notification__item-message">Elwis Mathew</span> added a new product <span className="notification__item-message_semimedium notification__item-message">Redmi Pro 7 Mobile</span></p>
                            <span className="notification__item-time">4 mins ago</span>
                        </div>
                    </li>
                </ul>
            </>
        )
    }
}

export default Notifications