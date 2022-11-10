import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/Home';

function App() {
  // You can put javascript code here or declare constants!
  // use {} inside html to access variables

  return (
    <Router>
      <div className='App'>
        <div className='content'>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        <footer></footer>
      </div>
    </Router>
  );
}

export default App;
