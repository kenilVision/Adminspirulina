import react, { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import {roots} from './route/Route'
import './App.css'

function App() {


  return (
    <>
     <BrowserRouter>
     <Routes>
     {roots.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                element={route.element}
              />
            ))}
     </Routes>
     </BrowserRouter>
     </> 
  )
}

export default App
