import LoginPage from './components/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUpPage from './components/SignUpPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import AddItemPage from './components/AddItemPage';
import WishlistPage from './components/WishlistPage';

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignUpPage/>}/>
            <Route path='/home' element={<HomePage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path='/additem' element={<AddItemPage/>}/>
            <Route path='/wishlist' element={<WishlistPage/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
