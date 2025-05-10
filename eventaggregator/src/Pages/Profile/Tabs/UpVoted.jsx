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

function UpVoted() {
  const [upvotes, setUpvotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db   = getFirestore();

    // wait for user
    const unsubAuth = onAuthStateChanged(auth, user => {
      if (!user) {
        setUpvotes([]);
        setLoading(false);
        return;
      }

      // /users/{uid}/upvoted ordered by votedAt desc
      const upvoteQuery = query(
        collection(doc(collection(db, 'users'), user.uid), 'upvotes'),
        orderBy('votedAt', 'desc')
      );

      const unsubUpvotes = onSnapshot(upvoteQuery, snap => {
        const items = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        setUpvotes(items);
        setLoading(false);
      });

      return () => unsubUpvotes();
    });

    return () => unsubAuth();
  }, []);

  if (loading) return <p>Loading your upvotes…</p>;
  if (upvotes.length === 0) return <p>You haven’t upvoted any posts yet.</p>;

  return (
    <div className="Comments">
      <h2>Your Upvoted Posts</h2>
      <ul>
        {upvotes.map(vote => {
          const titleText = vote.title ?? '';
          const bodyText  = vote.body ?? '';

          // choose title if present, else first 50 chars of body
          const displayText = titleText
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
                {displayText}
              </Link>
              <br/>
              <small>Upvoted at {when}</small>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UpVoted;
