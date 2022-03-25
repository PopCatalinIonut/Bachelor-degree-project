import LoginPage from './components/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUpPage from './components/SignUpPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignUpPage/>}/>
            <Route path='/home' element={<HomePage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
