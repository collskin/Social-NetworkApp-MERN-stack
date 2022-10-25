import Home from "./components/pages/home/Home";
import Profile from "./components/pages/profile/Profile"
import Main from "./components/pages/main/Main";
import { useContext } from "react";
import Chat from "./components/pages/chat/Chat"

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate ,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";


function App() {

  const {user} = useContext(AuthContext)
  return (
    <Router>
    <Routes>
           <Route path="/" element={user ? <Main /> : <Home/>} />
            
           <Route path="/profile/:username" element={ <Profile />} />

           <Route path="/register" element={user ? <Navigate to="/"/> : <Home />} />

           <Route path="/chat" element={!user ? <Navigate to="/"/> : <Chat />} /> 
      </Routes>
      </Router>

  
  );

}
export default App;
