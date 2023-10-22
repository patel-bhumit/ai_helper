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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = collection(db, 'bot');

function App() {
  const [text, setText] = useState('');
  const [summary, setsummary] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(docRef, orderBy('createdAt', 'desc'), limit(1)),
      (snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          setsummary(data.summary);
        });
      }
    );
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding text to Cloud Firestore');
      await addDoc(docRef, { text, createdAt: new Date() });
      console.log('Text added successfully');
    } catch (error) {
      console.error('Error adding text:', error);
    }
    setText('');
  };

  return (
    <div>
      <h2>Text Summarizer App</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          type='text'
          value={text}
          onChange={handleInputChange}
          placeholder='Enter text'
        />
        <br />
        <br />
        <button
          style={{
            backgroundColor: 'white',
            color: 'black',
          }}
          type='submit'
        >
          Submit
        </button>
      </form>
      <br />
      <h3>Summary:</h3>
      <div className='summary' style={{ fontSize: '12px' }}>
        {summary}
      </div>
    </div>
  );
}
export default App;
