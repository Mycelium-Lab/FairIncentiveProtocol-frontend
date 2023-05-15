import logo from './logo.svg';
import './App.css';
import './styles/auth.css'
import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from './MainPage';
import NFTClaimPage from './NFTClaimPage';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<MainPage/>}>
            </Route>
            <Route path='/claimnft' element={<NFTClaimPage/>}>
            </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
