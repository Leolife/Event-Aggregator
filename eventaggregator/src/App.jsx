import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import IndividualPostView from './Pages/Forum/IndividualPostView/IndividualPostView';
import { Profile } from './Pages/Profile/Profile';
import { Forum } from './Pages/Forum/Forum';
import { RecommendedForum } from './Pages/Forum/Recommended/RecommendedForum';
import { HottestForum } from './Pages/Forum//Hottest/HottestForum';
import { LatestForum } from './Pages/Forum/Latest/LatestForum';
import  ForumSearch  from './Pages/Forum/Search/ForumSearch';
import { EventCategory } from './Pages/EventCategory/EventCategory';
import { Calendar } from './Pages/Calendar/Calendar';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Settings from './Pages/Settings/Settings';
import TestUserData from './utils/Debuguser';


function App() {

  const [sidebar, setSidebar] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>

      <Navbar setSidebar={setSidebar} user={user} />
      <Routes>
      <Route path='/' element={<Home sidebar={sidebar} user={user} />} />
        <Route path='/forum' element={<Forum sidebar={sidebar} user={user} />}/>
        <Route path='/forum/recommended' element={<RecommendedForum sidebar={sidebar} user={user} />}/>
        <Route path='/forum/hottest' element={<HottestForum sidebar={sidebar} user={user} />}/>
        <Route path='/forum/latest' element={<LatestForum sidebar={sidebar} user={user} />}/>
        <Route path='/forum/search' element={<ForumSearch sidebar={sidebar} user={user} />}/>
        <Route path="/forum/post/:postId" element={<IndividualPostView sidebar={sidebar} />} />
        <Route path='/mycalendars' element={ <Calendar sidebar={sidebar} user={user} />} />
        <Route path='/profile' element={ <Profile sidebar={sidebar} user={user} />} />
        <Route path='settings' element={<Settings />}/>
        <Route path='/event/category/:categoryName' element={ <EventCategory sidebar={sidebar} user={user} />} />
        <Route path='/debug' element={<TestUserData />}/>
      </Routes>
      
    </div>
  );
}

export default App;
