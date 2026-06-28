import React from 'react'
import {Routes,BrowserRouter,Route} from 'react-router-dom'
import Home from './components/frontend/Home'
import About from './components/frontend/About'
import './assets/css/style.scss'
import Services from './components/frontend/Services'
import Projects from './components/frontend/Projects'
import Blogs from './components/frontend/Blogs'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/services' element={<Services/>} />
          <Route path='projects' element={<Projects/>} />
          <Route path='/blogs' element={<Blogs/>} />
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App