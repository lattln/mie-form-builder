import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import EditorContextProvider from './components/EditorContext';
import '../src/blockTools_css/block-renderSetting-styles.css';
import '../src/blockTools_css/block-styles.css';
import '../src/blockTools_css/universal-styles.css';
import './App.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div className='root'>
      <EditorContextProvider>
          <App />
      </EditorContextProvider>
  </div>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
