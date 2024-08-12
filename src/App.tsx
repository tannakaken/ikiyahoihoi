import { WigglingCharacters } from './WigglingCharacters'
import { novel1 } from './assets/novel'
import { anohito } from './assets/anohito'
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
            <h1>行きはよいよい、帰りは怖い</h1>
            <div><Link to="/vanish">VANISH</Link></div>
            <div><Link to="/randomize">RANDOMIZE</Link></div>
            <div><Link to="/wiggling-characters">WIGGLING CHARACTERS</Link></div>
            <div><Link to="/glitch">GLITCH</Link></div>
          </div>} />
          <Route path="/vanish" element={<Vanish novel={anohito} />} />
          <Route path="/wiggling-characters" element={<WigglingCharacters novel={novel1} />} />
          <Route path="/glitch" element={<Glitch novel={novel1} />} />
          <Route path="/randomize" element={<Randomize novel={novel1} />} />
        </Routes>        
      </BrowserRouter>
    </div>
  )
}

export default App
