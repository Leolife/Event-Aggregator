import React, { useRef, useState, useEffect } from "react";
import { firestore } from "../firebase";
import { addDoc, collection, getDocs } from "@firebase/firestore";

export default function Home() {
    const messageRef = useRef();
    const [messages, setMessages] = useState([]);
    const ref = collection(firestore, "messages");

    const handleSave = async(e) => {
        e.preventDefault();
        console.log(messageRef.current.value);

        // Creates an object with the message data
        let data = {
            message: messageRef.current.value,
        }

        try {
            await addDoc(ref, data);  // Adds the new document to Firestore Database
            messageRef.current.value = ""; // Clear input after sending/successful save
            getMessages(); // Refresh messages after adding new one
        } catch(e) {
            console.log(e);
        }
    }

    const getMessages = async() => {
        try {
            const messagesSnapshot = await getDocs(ref);  // fetches all documents from the messages collection in database
            const messagesList = messagesSnapshot.docs.map(doc => ({  // goes through documents and creates an array of msgs each with own ID and data
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messagesList);  // updates the messages state with the fetched data
        } catch(e) {
            console.log("Error getting messages:", e);
        }
    }

    // Fetch messages when component mounts
    useEffect(() => {
        getMessages();
    }, []);

    return (
        <div className="p-4">
            <form onSubmit={handleSave} className="mb-6">
                <label className="block mb-2">Enter Message </label>
                <input 
                    type="text" 
                    ref={messageRef}  // This is where the retrieval is displayed on website
                    className="border p-2 mr-2" 
                />
                <button 
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </form>

            <div className="mt-4">
                <h2 className="text-xl font-bold mb-4">Messages:</h2>
                {messages.map(msg => (
                    <div 
                        key={msg.id}
                        className="border p-3 mb-2 rounded shadow"
                    >
                        {msg.message}
                    </div>
                ))}
            </div>
        </div>
    );
}