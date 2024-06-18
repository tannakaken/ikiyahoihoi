import React from 'react'
import { WigglingCharacters } from './WigglingCharacters'
import { novel1 } from './assets/novel'
import "./App.css"
import { Glitch } from './Glitch'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Randomize } from './Randomize'
import { Vanish } from './Vanish'

function App() {

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>
            <div><Link to="/vanish">VANISH</Link></div>
            <div><Link to="/randomize">RANDOMIZE</Link></div>
            <div><Link to="/wiggling-characters">WIGGLING CHARACTERS</Link></div>
            <div><Link to="/glitch">GLITCH</Link></div>
          </div>} />
          <Route path="/vanish" element={<Vanish body={novel1} />} />
          <Route path="/wiggling-characters" element={<WigglingCharacters body={novel1} />} />
          <Route path="/glitch" element={<Glitch body={novel1} />} />
          <Route path="/randomize" element={<Randomize body={novel1} />} />
        </Routes>        
      </BrowserRouter>
    </div>
  )
}

export default App
