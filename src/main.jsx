import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './view/App'
import './index.css';
import { HashRouter } from "react-router-dom";


window.backendServerAddress = "localhost";
window.backendServerPort = "5000";
window.backendRoutePrefix = "/"

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
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode >,
)
