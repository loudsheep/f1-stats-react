import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './view/App'
import './index.css';
import { BrowserRouter } from "react-router-dom";

window.backendServerAddress = "141.147.4.27";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
      </BrowserRouter>
  </React.StrictMode>,
)
