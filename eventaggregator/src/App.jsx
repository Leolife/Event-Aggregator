import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import { Profile } from './Pages/Profile/Profile';


function App() {
  const [sidebar, setSidebar] = useState(true);
  return (
      <div>
        <Navbar setSidebar={setSidebar}/>
        <Routes>
          <Route path='/' element={<Home sidebar={sidebar}/>} />
          <Route path='/profile' element={<Profile sidebar={sidebar}/>} />
        </Routes>
      </div>

  );
}

export default App;
