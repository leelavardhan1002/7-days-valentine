import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import FlowerGarden from './pages/FlowerGarden/FlowerGarden';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/day1" element={<FlowerGarden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
