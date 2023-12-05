import './styles/globals.scss';
import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// components
import MainNav from './components/mainNav/MainNav';
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import PageNotFound from "./components/pageNotFound/PageNotFound";
import Footer from "./components/footer/Footer";
import Intro from './pages/intro/Intro';

// pages
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Write from "./pages/write/Write";
import EditRoom from './pages/editRoom/EditRoom';
import Contacts from './pages/contacts/Contacts';

import { Context } from "./context/Context";
import Registrations from './pages/registrations/Registrations';
import UtilityBills from './pages/utilityBills/UtilityBills';
import CreateUtilityBill from './pages/createUtilityBills/CreateUtilityBills';
import HistoryContacts from './pages/historyContacts/historyContacts';

function App() {
  const { user } = useContext(Context);
  return (
    <BrowserRouter>
      <MainNav />
      <ScrollToTop />
      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/search" element={<Home />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/contacts" element={user ? <Contacts /> : <Login />} />
        <Route path="/register" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/write" element={user ? <Write /> : <Register />} />
        <Route path="/room/edit/:id" element={user ? <EditRoom /> : <Register />} />
        <Route path="/settings" element={user ? <Settings /> : <Register />} />
        <Route path="/registrations/:username" element={user ? <Registrations /> : <Login />} />
        <Route path="/registrations/" element={user ? <Registrations /> : <Login />} />
        <Route path="/utilityBills/" element={user ? <UtilityBills /> : <Login />} />
        <Route path="/createUtilityBills/" element={user ? <CreateUtilityBill /> : <Login />} />
        <Route path="/historyContacts/" element={user ? <HistoryContacts /> : <Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
