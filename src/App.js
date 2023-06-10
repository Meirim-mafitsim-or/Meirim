import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./common/Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import About from "./pages/About";
import Event from "./pages/Event";
import CreatShabat from './pages/CreatShabat';
import ManageCampers from './pages/ManageCampers';
import FamiliesManagment from './pages/FamiliesManagment';
import Families from './pages/Families';
import EditFamily from './pages/EditFamily';
import { UserContext } from './common/UserContext';
import { useContext } from 'react';
import AdminRegistration from './pages/AdminRegistration';
import EditShabat from './pages/EditShabat';
import ManageCoordinators from './pages/ManageCoordinators';
import DataReport from './pages/DataReport';
import Messages from './pages/MessagesView';



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
          {user && <Route path="Families" element={<FamiliesManagment />} />}
          {user && <Route path="Families/:id" element={<Families />} />}
          {user && <Route path="Families/:id/:family" element={<EditFamily/>} />}
          {user && <Route path="CreatShabat" element={<CreatShabat />} />}
          {user && <Route path="DataReport" element={<DataReport />} />}
          {user && <Route path="ManageCampers" element={<ManageCampers />} />}
          {user && <Route path="ManageCoordinators" element={<ManageCoordinators />} />}
          {user && <Route path="Messages" element={<Messages />} />}
          <Route path="AdminRegistration" element={<AdminRegistration />} />
          <Route path="EditShabat/:id" element={<EditShabat />} />
          <Route path="*" element={<h1>Not Found</h1>} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
} 

export default App;
