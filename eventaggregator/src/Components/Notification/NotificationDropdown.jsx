import React, { useState, useEffect, useRef } from 'react';
import './NotificationDropdown.css';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { auth, firestore } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      const q = query(
        collection(firestore, `users/${user.uid}/notifications`),
        orderBy('timestamp', 'desc')
      );
      const unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(data);
      });
      return () => unsub();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setVisible(false);
      }
    };
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible]);

  const markAllAsRead = () => {
    const user = auth.currentUser;
    if (!user) return;
    notifications.forEach(async (notif) => {
      if (!notif.read) {
        const notifRef = doc(firestore, `users/${user.uid}/notifications/${notif.id}`);
        await updateDoc(notifRef, { read: true });
      }
    });
  };

  const clearAllNotifications = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const notifRef = collection(firestore, `users/${user.uid}/notifications`);
    const snapshot = await getDocs(notifRef);
    const deletions = snapshot.docs.map(docSnap =>
      deleteDoc(doc(firestore, `users/${user.uid}/notifications/${docSnap.id}`))
    );
    await Promise.all(deletions);
    setNotifications([]);
  };

  const handleToggleDropdown = () => {
    const newVisible = !visible;
    setVisible(newVisible);
    if (!visible) markAllAsRead();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notif-container" ref={dropdownRef}>
      {auth.currentUser && (
        <div className="notif-icon-wrapper">
          <button onClick={handleToggleDropdown} className="notif-bell">
            🔔
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
        </div>
      )}

      {visible && (
        <div className="notif-dropdown">
          {notifications.length === 0 ? (
            <div className="notif-empty">No notifications</div>
          ) : (
            <>
              <div className="notif-scroll-container">
                {notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    to="/friends?tab=requests"
                    className="notif-item"
                    onClick={() => setVisible(false)}
                  >
                    <div className="notif-title"><strong>{notif.title}</strong></div>
                    <div className="notif-body">{notif.body}</div>
                  </Link>
                ))}
              </div>
              <div className="notif-clear-wrapper">
                <button className="notif-clear-btn" onClick={clearAllNotifications}>
                  Clear All
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
