import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // or `next/link` if you’re in Next.js
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

function UserPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db   = getFirestore();

    // listen for signed-in user
    const unsubAuth = onAuthStateChanged(auth, user => {
      if (!user) {
        setPosts([]);
        setLoading(false);
        return;
      }

      // build query: /users/{uid}/posts ordered by timestamp desc
      const postsQuery = query(
        collection(doc(collection(db, 'users'), user.uid), 'posts'),
        orderBy('timestamp', 'desc')
      );

      // subscribe to realtime updates
      const unsubPosts = onSnapshot(postsQuery, snapshot => {
        const items = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        setPosts(items);
        setLoading(false);
      });

      return () => unsubPosts();
    });

    return () => unsubAuth();
  }, []);

  if (loading) return <p>Loading your posts…</p>;
  if (posts.length === 0) return <p>You haven’t made any posts yet.</p>;

  return (
    <div className="Posts">
      <h2>Your Posts</h2>
      <ul>
        {posts.map(post => {
          // default body to empty string so .length/.slice never crash
          const bodyText = post.body ?? '';

          // convert Firestore Timestamp to JS Date
          const date = post.timestamp?.toDate?.();
          const when = date ? date.toLocaleString() : 'Unknown date';

          return (
            <li key={post.id} style={{ marginBottom: '1rem' }}>
              <Link to={`/Forum/post/${post.id}`}>
                {bodyText.length > 50
                  ? bodyText.slice(0, 50) + '…'
                  : bodyText
                }
              </Link>
              <br />
              <small>{when}</small>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserPosts;
