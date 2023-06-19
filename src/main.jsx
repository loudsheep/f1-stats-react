import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './view/App'
import './index.css';
import { BrowserRouter } from "react-router-dom";

// window.backendServerAddress = "141.147.4.27";
window.backendServerAddress = "localhost";
window.backendServerPort = "";
window.backendRoutePrefix = "/api"

window.getBackendURL = () => {
  let url = "http://" + window.backendServerAddress;
  if (window.backendServerPort != null) {
    url += ":" + window.backendServerPort;
  }
  url += window.backendRoutePrefix;

  return url
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
