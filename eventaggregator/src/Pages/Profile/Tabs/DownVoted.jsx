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
  const [downvotes, setDownvotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db   = getFirestore();

    // listen for user
    const unsubAuth = onAuthStateChanged(auth, user => {
      if (!user) {
        setDownvotes([]);
        setLoading(false);
        return;
      }

      // /users/{uid}/downvotes ordered by votedAt desc
      const downvoteQuery = query(
        collection(doc(collection(db, 'users'), user.uid), 'downvotes'),
        orderBy('votedAt', 'desc')
      );

      const unsub = onSnapshot(downvoteQuery, snap => {
        const items = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        setDownvotes(items);
        setLoading(false);
      });

      return () => unsub();
    });

    return () => unsubAuth();
  }, []);

  if (loading) return <p>Loading your downvotes…</p>;
  if (downvotes.length === 0) return <p>You haven’t downvoted any posts yet.</p>;

  return (
    <div className="Comments">
      <h2>Your Downvoted Posts</h2>
      <ul>
        {downvotes.map(vote => {
          const titleText = vote.title ?? '';
          const bodyText  = vote.body ?? '';
          const display   = titleText
            ? titleText
            : (bodyText.length > 50
                ? bodyText.slice(0, 50) + '…'
                : bodyText
              );

          // votedAt → JS Date
          const date = vote.votedAt?.toDate?.();
          const when = date ? date.toLocaleString() : 'Unknown date';

          return (
            <li key={vote.id} style={{ marginBottom: '1rem' }}>
              <Link to={`/Forum/post/${vote.postId}`}>
                {display}
              </Link>
              <br/>
              <small>Downvoted at {when}</small>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Comments;
