import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import { Profile } from './Pages/Profile/Profile';
import { EventCategory } from './Pages/EventCategory/EventCategory';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Settings from './Pages/Settings/Settings';


function App() {

  const [data, setData] = useState([{}])

  const [sidebar, setSidebar] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/games").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
      }
    )
    }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or your loading spinner
  }

  return (
    <div>

      <Navbar setSidebar={setSidebar} user={user} />
      <Routes>
        <Route path='/' element={<Home sidebar={sidebar} user={user} data={data}/>} />
        <Route path='/profile' element={ <Profile sidebar={sidebar} user={user} />} />
        <Route path='settings' element={<Settings />}/>
        <Route path='/event/category/:categoryName' element={ <EventCategory sidebar={sidebar} user={user} />} />
      </Routes>
      
    </div>
  );
}

export default App;
