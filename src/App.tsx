// App.tsx
import { Routes } from './app/routes';
import { useEffect } from 'react';
import { getAnonymousUserId } from './utils/anonymousIdentity';
import './App.css'; 

function App() {
  useEffect(() => {
    // Ensure anonymous identity is initialized
    getAnonymousUserId();
  }, []);

  return <Routes />;
}

export default App;
