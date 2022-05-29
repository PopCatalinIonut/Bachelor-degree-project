import LoginPage from './components/pages/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUpPage from './components/pages/SignUpPage';
import HomePage from './components/pages/HomePage';
import ProfilePage from './components/pages/ProfilePage';
import AddItemPage from './components/pages/AddItemPage';
import WishlistPage from './components/pages/WishlistPage';
import MarketplacePage from './components/pages/MarketplacePage';
import ChatPage from './components/pages/ChatPage';
import OutfitGeneratorPage from './components/pages/OutfitGeneratorPage';
import "./global.css"
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
            <Route path='/marketplace' element={<MarketplacePage/>}/>
            <Route path='/chat' element={<ChatPage/>}/>
            <Route path='/outfitGenerator' element={<OutfitGeneratorPage/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
