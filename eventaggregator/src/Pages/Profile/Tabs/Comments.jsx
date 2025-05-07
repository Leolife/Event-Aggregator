// src/Pages/Profile/Tabs/Comments.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';   // or next/link if you’re in Next.js
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

function Comments() {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db   = getFirestore();

    // wait for current user
    const unsubAuth = onAuthStateChanged(auth, user => {
      if (!user) {
        setReplies([]);
        setLoading(false);
        return;
      }

      // build query: /users/{uid}/replies ordered by timestamp desc
      const repliesQuery = query(
        collection(doc(collection(db, 'users'), user.uid), 'replies'),
        orderBy('timestamp', 'desc')
      );

      // listen for realtime updates
      const unsubReplies = onSnapshot(repliesQuery, snapshot => {
        const items = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        setReplies(items);
        setLoading(false);
      });

      return () => unsubReplies();
    });

    return () => unsubAuth();
  }, []);

  if (loading) return <p>Loading your replies…</p>;
  if (replies.length === 0) return <p>You haven’t made any replies yet.</p>;

  return (
    <div className="Comments">
      <h2>Your Replies</h2>
      <ul>
        {replies.map(reply => {
          // safely default body to empty string
          const bodyText = reply.body ?? '';

          // format timestamp
          const date = reply.timestamp?.toDate?.();
          const when = date ? date.toLocaleString() : 'Unknown date';

          // link to the original post, not the reply
          const targetUrl = `/Forum/post/${reply.postId}`;

          return (
            <li key={reply.id} style={{ marginBottom: '1rem' }}>
              <Link to={targetUrl}>
                {bodyText.length > 50
                  ? bodyText.slice(0, 50) + '…'
                  : bodyText
                }
              </Link>
              <br />
              <small>on {when}</small>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Comments;
