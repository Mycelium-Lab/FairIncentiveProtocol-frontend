import logo from './logo.svg';
import './App.css';
import './styles/auth.css'
import { Component } from 'react';
import SignUp from './auth/signup'; 
import SignIn from './auth/signin';
import { getCookie } from './utils/cookie';
import { config } from './utils/config';
import { checkAuth } from './utils/checkAuth';
import MainScreen from './MainScreen';

const switcher = {
  signup: 'signup',
  signin: 'signin',
  signed: 'signed'
}

class App extends Component {

  constructor(){
    super()
    this.state = {
      switcher: switcher.signin,
      auth: null
    }
  }

  async componentDidMount() {
    const checker = await checkAuth()
    if (checker) this.setState({switcher: switcher.signed, auth: checker.body.data})
  }

  switch(event) {
      this.setState({
          switcher: this.state.switcher === switcher.signup ? switcher.signin : switcher.signup
      })
      event.target.textContent = this.state.switcher.toUpperCase()
  }

  switch = this.switch.bind(this)

      getWindow() {
      if (this.state.switcher === switcher.signin) return <SignIn/>
      if (this.state.switcher === switcher.signup) return <SignUp/>
      return <MainScreen auth={this.state.auth}/>
  }

  render() {
    return (
      <div className="App">
            {
                this.getWindow()
            }
            {
                this.state.switcher !== switcher.signed
                ?
                <div className='switch-button'>
                {this.state.switcher === switcher.signin ? "Don't have an account?" : "Already a user?"} 
                <button onClick={this.switch} value={switcher.signup}>{switcher.signup.toUpperCase()}</button>
                </div>
                :
                null
            }
      </div>
    );
  }
}

export default App;
