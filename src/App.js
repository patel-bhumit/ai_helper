import React, { useState, useEffect } from 'react';
import './App.css';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
  
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAffuKEzq3SxVh7gVaGzBH_NKorT7spBGk",
  authDomain: "aihelpr-a1a75.firebaseapp.com",
  projectId: "aihelpr-a1a75",
  storageBucket: "aihelpr-a1a75.appspot.com",
  messagingSenderId: "370882294163",
  appId: "1:370882294163:web:846f0b3d47dac2289af866",
  measurementId: "G-81W6Y0WLJ9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = collection(db, 'bot');
const docRef2 = collection(db, 'chat_bot');

function App() {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [response, setResponse] = useState('');
  const [showResults, setShowResults] = useState(false); // New state for showing results

  useEffect(() => {
    const savedText = localStorage.getItem('text');
    if (savedText) {
      setText(savedText);
      setPrompt(savedText);
    }
  }, []);

  useEffect(() => {
    const unsubscribe1 = onSnapshot(
      query(docRef, orderBy('createdAt', 'desc'), limit(1)),
      (snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          setSummary(data.summary);
        });
      }
    );

    const unsubscribe2 = onSnapshot(
      query(docRef2, orderBy('createdAt', 'desc'), limit(1)),
      (snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          setResponse(data.response);
        });
      }
    );

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setPrompt(newText);
    localStorage.setItem('text', newText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding text to Cloud Firestore');
      await addDoc(docRef, { text, createdAt: new Date() });
      await addDoc(docRef2, { prompt, createdAt: new Date() });
      console.log('Text added successfully');
    } catch (error) {
      console.error('Error adding text:', error);
    }

    setResponse('');
    setSummary('');
    setText('');
    localStorage.removeItem('text');
    
    // Show results when the form is submitted
    setShowResults(true);
  };

  return (
    <div className="container">
      <h2 className="title">Assignment Summarizer</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="Enter text"
          className="text-area"
        />
        <br />
        <br />
        <button type="submit" className="button">
          Generate
        </button>
      </form>
      <br />
      {showResults && (
        <div>
          <h3>Summary:</h3>
          <p className="summary" style={{ fontSize: '20px' }}>
            {summary}
          </p>
          <br />
          <br />
          <h3>Time Based Distribution:</h3>
          <p className="response" style={{ fontSize: '20px' }}>
            {response}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;




