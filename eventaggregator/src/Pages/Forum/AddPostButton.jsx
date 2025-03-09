import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import ForumData from '../../utils/ForumData';
import { useNavigate } from 'react-router-dom';
import Overlays from '../../Components/Overlays';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const AddPostButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
    
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setIsLoggedIn(!!user); // `true` if user exists, `false` otherwise
        });
    
        return () => unsubscribe(); // Cleanup listener on unmount
      }, []);
    
    const handleClick = () => {
        if (isLoggedIn) {
            openModal('addpost');
        } else {
            openModal('login');
        }
    }

    const openModal = (type) => {
        setModalType(type);
        setIsOpen(true);
    }

    return (
        <>
            <button className="add-post" onClick={() => { handleClick() }}>
                +
            </button>
            <Overlays modalType={modalType} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )

}

export default AddPostButton;