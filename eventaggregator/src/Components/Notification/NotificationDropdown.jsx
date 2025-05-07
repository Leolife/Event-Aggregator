import React, { useState, useEffect } from 'react';
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

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('notif-dropdown');
      const bell = document.getElementById('notif-bell-button');
      if (dropdown && !dropdown.contains(event.target) && bell && !bell.contains(event.target)) {
        setVisible(false);
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
    if (!visible) markAllAsRead(); // Mark as read when dropdown opens
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notif-container">
      {auth.currentUser && (
        <div className="notif-icon-wrapper">
          <button id="notif-bell-button" onClick={handleToggleDropdown} className="notif-bell">
            🔔
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
        </div>
      )}

      {visible && (
        <div id="notif-dropdown" className="notif-dropdown">
          {notifications.length === 0 ? (
            <div className="notif-empty">No notifications</div>
          ) : (
            <>
              {/* Scrollable area */}
              <div className="notif-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map((notif) => (
                  notif.link ? (
                    <Link
                      key={notif.id}
                      to={notif.link}
                      className="notif-item"
                      onClick={() => setVisible(false)}
                    >
                      <strong>{notif.title}</strong>
                      <p>{notif.body}</p>
                    </Link>
                  ) : (
                    <div
                      key={notif.id}
                      className="notif-item"
                    >
                      <strong>{notif.title}</strong>
                      <p>{notif.body}</p>
                    </div>
                  )
                ))}
              </div>

              {/* Clear All stays always at bottom */}
              <div style={{ textAlign: 'center', marginTop: '6px' }}>
                <button
                  className="notif-clear-btn"
                  onClick={clearAllNotifications}
                >
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
