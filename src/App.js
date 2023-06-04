import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./common/Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import About from "./pages/About";
import Event from "./pages/Event";
import CreatShabat from './pages/CreatShabat';
import FamiliesManagment from './pages/FamiliesManagment';
import Families from './pages/Families';
import EditFamily from './pages/EditFamily';
import { UserContext } from './common/UserContext';
import { useContext } from 'react';
function App() {
  const {user} = useContext(UserContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Login" element={<Login />} />
          <Route path="Contact" element={<Contact />} />
          <Route path="About" element={<About />} />
          <Route path="Event/:id" element={<Event />} />
          <Route path="Families" element={<FamiliesManagment />} />
          <Route path="Families/:id" element={<Families />} />
          <Route path="Families/:id/:family" element={<EditFamily/>} />
          {user && <Route path="CreatShabat" element={<CreatShabat />} />}
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
} 

export default App;
