import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import FlowerGarden from "./pages/FlowerGarden/FlowerGarden";
import ProposePage from "./pages/ProposePage/ProposePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/day1" element={<FlowerGarden />} />
        <Route path="/day2" element={<ProposePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
