import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Layout from './common/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Contact from './pages/Contact';
import 'bootstrap/dist/css/bootstrap.min.css';


import reportWebVitals from './reportWebVitals';
import { LanguageProvider } from './common/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <LanguageProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Login" element={<Login/>} /> 
          <Route path="Contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);

reportWebVitals();
