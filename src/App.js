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

      formatText() {
        const splited = splitText(this.state.switcher, 'sign')
        return capitalize(splited)
      }
      getWindow() {
      if (this.state.switcher === switcher.signin) return <SignIn switcher={switcher.signup} switcherText={this.formatText()} switch={this.switch}/>
      if (this.state.switcher === switcher.signup) return <SignUp switcher={switcher.signup} switcherText={this.formatText()} switch={this.switch}/>
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
