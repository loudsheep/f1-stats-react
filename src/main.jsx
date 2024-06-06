import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './view/App'
import './index.css';
import { HashRouter } from "react-router-dom";


window.backendServerAddress = "https://f1.loudsheep.pl";
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

window.getFullYear = () => {
    return new Date().getFullYear();
};

window.yearSelectOptions = () => {
    let res = [];
    for (let i = window.getFullYear(); i >= 2018; i--) {
        res.push(i);
    }
    return res;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode >,
)
