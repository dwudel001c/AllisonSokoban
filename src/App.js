import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './Canvas.js'

class App extends Component {
  render() {
      return <div className="App">
          <header className="App-header">

              <h1 className="App-title">Welcome to Allison's Sokoban</h1>
          </header>

          <Canvas></Canvas>
      </div>;
  }
}

export default App;
