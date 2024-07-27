import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import Myform from './components/Myform'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <Myform/>
  </React.StrictMode>,
)
