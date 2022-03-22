import LoginPage from './components/LoginPage';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import SignUpPage from './components/SignUpPage';

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignUpPage/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
