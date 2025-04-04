import React, { useEffect} from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import List from './components/List';
import Detail from './components/Detail';
import Notification from './components/Notification';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { userValue, authLoading, chatValue } from './lib/userStore';
import { useAtom, useAtomValue } from 'jotai';

function App() {
  const [user, setUser ] =  useAtom(userValue);
  const [ isLoading, setIsLoading ] =  useAtom(authLoading);
  const chat = useAtomValue(chatValue);

  const chatId = chat.chatId;

  const fetchUserInfo = async (uid) => {
    if (!uid) {
      setUser(null);
      setIsLoading(false);
      return;
    }
  
    setIsLoading(true); 
  
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log(err);
      setUser(null);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() =>{
    const unSub = onAuthStateChanged(auth, (user)=>{
fetchUserInfo(user?.uid);
    });
    return () =>{
      unSub();
    };
  },[]); 

  if(isLoading) return <div className='loading'>Loading...</div>

  return (
    <div className='container'>
      
      {
        user ? (  
          <>
          <List/>
          { chatId && <Chat/> }
          { chatId && <Detail/> }
          </>
        ) : (
        <Login/>)
      }
      <Notification/>
    </div>

  )
}

export default App



















