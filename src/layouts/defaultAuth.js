import { Component } from "react";


class DefaultAuth extends Component {
    constructor() {
        super()
    }
    
    render() {
        return (
            <>
                <img className="auth-decore_left-people" src={require('../media/auth/man.png')}/>
                <img className="auth-decore_right-people" src={require('../media/auth/woman.png')}/>
            </>
        )
    }
}


export default DefaultAuth