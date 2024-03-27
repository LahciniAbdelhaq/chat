
import { BrowserRouter, Routes ,Route} from 'react-router-dom';
import './App.css';
import Login from './component/Login/Login';
import Sinup from './component/Sinup/Sinup';  
import Home from './component/home/Home';

function App() {
  return (
    <div className="App">
        <BrowserRouter >
        <Routes>
          <Route index path='/' element={<Home/>} />
          <Route path='/login'   element={<Login/>} />
          <Route path='/sinup' element={<Sinup/>} />
        </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
