import LoginPage from './components/pages/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUpPage from './components/pages/SignUpPage';
import HomePage from './components/pages/HomePage';
import "./global.css"
function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignUpPage/>}/>
            <Route path='/home' element={<HomePage/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
