import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './view/App'
import './index.css';
import { HashRouter } from "react-router-dom";


window.backendServerAddress = "https://loudsheep.ddns.net";
window.backendServerPort = "";
window.backendRoutePrefix = "/api"

window.getBackendURL = () => {
  let url = window.backendServerAddress;
  if (window.backendServerPort != null) {
    url += ":" + window.backendServerPort;
  }
  url += window.backendRoutePrefix;

  return url
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode >,
)
