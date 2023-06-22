import { Fragment } from "react"
import { Route, Routes } from "react-router-dom"

import Navigation from './components/Navigation/Navigation'
import MainPage from './pages/MainPage/MainPage'
import LoginPage from './pages/LoginPage/LoginPage'
import Dashboard from './pages/Dashboard/Dashboard'
import LecturePage from './pages/LecturePage/LecturePage'
import UpPage from './pages/UpPage/UpPage'
import CreatePage from './pages/CreatePage/CreatePage'

function App() {
  return (
    <Fragment>
      <Navigation />

      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<UpPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/lecture/:id' element={<LecturePage />} />
        <Route path='/create' element={<CreatePage />} />
      </Routes>
    </Fragment>
  )
}

export default App