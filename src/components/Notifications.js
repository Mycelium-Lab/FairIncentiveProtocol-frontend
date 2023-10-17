import React, { Component } from "react";
import notifications from '../data/notifications'

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
                    {
                        notifications.map(v => 
                            <li key={v.id} className="notification__item">
                                <img src={v.avatar}></img>
                                <div className="notification__item-desc">
                                    <p className="notification__item-message"><span className="notification__item-message_semimedium notification__item-message">{v.name}</span> added a new product <span className="notification__item-message_semimedium notification__item-message">Redmi Pro 7 Mobile</span></p>
                                    <span className="notification__item-time">{v.ago}</span>
                                </div>
                            </li>
                        )
                    }
                </ul>
            </>
        )
    }
}

export default Notifications