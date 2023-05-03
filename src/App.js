import logo from './logo.svg';
import './App.css';
import './styles/auth.css'
import SignUp from './auth/signup'; 
import { Component } from 'react';
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
      switcher: switcher.signin
    }
  }

  async componentDidMount() {
    const checker = await checkAuth()
    if (checker) this.setState({switcher: switcher.signed})
  }

  switch(event) {
    this.setState({
      switcher: this.state.switcher === switcher.signup ? switcher.signin : switcher.signup
    })
    event.target.textContent = this.state.switcher
  }

  switch = this.switch.bind(this)

  getWindow() {
    if (this.state.switcher === switcher.signin) return <SignIn/>
    if (this.state.switcher === switcher.signup) return <SignUp/>
    return <MainScreen/>
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
          <button onClick={this.switch} className='ghost-round' value={switcher.signup}>{switcher.signup}</button>
          :
          null
        }
      </div>
    );
  }
}

export default App;
