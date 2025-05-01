import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import IndividualPostView from './Pages/Forum/IndividualPostView/IndividualPostView';
import { Profile } from './Pages/Profile/Profile';
import { Friends } from './Pages/Friends/Friends';
import { Forum } from './Pages/Forum/Forum';
import { EventPage } from './Pages/Events/EventPage';
import { EventCategory } from './Pages/EventCategory/EventCategory';
import { Calendar } from './Pages/Calendar/Calendar';
import { auth, firestore } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Settings from './Pages/Settings/Settings';
import TestUserData from './utils/Debuguser';
import PreGeneratedCalendar from './Components/Calendar/PreGeneratedCalendar';


function App() {

  const [sidebar, setSidebar] = useState(true);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Fetch theme from user
  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(firestore, 'users', user.uid);
    const unsubscribe= onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        if ('theme' in userData) {
          setTheme(userData.theme);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    // Set Theme based on stored theme
    <div className="App" data-theme={theme ? "dark" : "light"}>

      <Navbar setSidebar={setSidebar} user={user} />
      <Routes>
        <Route path='/' element={<Home sidebar={sidebar} user={user} />} />
        <Route path='/forum' element={<Forum sidebar={sidebar} user={user} />} />
        <Route path="/forum/post/:postId" element={<IndividualPostView sidebar={sidebar} />} />
        <Route path='/mycalendars' element={<Calendar sidebar={sidebar} user={user} />} />
        <Route path='/profile/:userId' element={<Profile sidebar={sidebar} user={user} />} />
        <Route path='/friends' element={<Friends sidebar={sidebar} user={user} />} />
        <Route path='settings' element={<Settings />} />
        <Route path='/event/category/:categoryName' element={<EventCategory sidebar={sidebar} user={user} />} />
        <Route path="/event/:eventId" element={<EventPage sidebar={sidebar} user={user} />} />
        <Route path='/debug' element={<TestUserData />} />
        <Route path="/calendar-static/:calendarType" element={<PreGeneratedCalendar />} />
      </Routes>

    </div>
  );
}

export default App;
