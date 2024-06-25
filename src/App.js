import logo from './logo.svg';
import './App.scss';
import { Component } from 'react';
import SignUp from './components/auth/signup'; 
import SignIn from './components/auth/signin';
import { getCookie } from './utils/cookie';
import { config } from './utils/config';
import { checkAuth } from './utils/checkAuth';
import MainScreen from './MainScreen';
import splitText from './utils/textFormatting/splitText';
import capitalize from './utils/textFormatting/capitalize';
import Forgot from './components/auth/forgot';

const switcher = {
  signup: 'signup',
  signin: 'signin',
  signed: 'signed',
  forgot: 'forgot'
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
    const urlParams = new URLSearchParams(window.location.search);
    const tokenReset = urlParams.get('tokenreset');
    document.cookie = `token=${tokenReset}`
    const checker = await checkAuth()
    if (checker) this.setState({switcher: switcher.signed, auth: checker.body.data})
  }

  switch(event, value) {
      this.setState({
          switcher: value
      })
      event.target.textContent = this.state.switcher.toUpperCase()
  }

  switch = this.switch.bind(this)

      formatText(text) {
        const splited = splitText(text, 'sign')
        return capitalize(splited)
      }
      getWindow() {
      if (this.state.switcher === switcher.signin) return <SignIn switcher={{signup: switcher.signup, forgot: switcher.forgot}} switcherText={this.formatText(switcher.signup)} switch={this.switch}/>
      if (this.state.switcher === switcher.signup) return <SignUp switcher={switcher.signin} switcherText={this.formatText(switcher.signin)} switch={this.switch}/>
      if (this.state.switcher === switcher.forgot) return <Forgot switcher={switcher.signin} switch={this.switch}/>
      return <MainScreen auth={this.state.auth}/>
  }

  render() {
    return (
      <div className="App">
            {
                this.getWindow()
            }
      </div>
    );
  }
}

export default App;
