import logo from './logo.svg';
import InputLayout from './pages/InputLayout.jsx'
import ResultsLayout from './pages/ResultsLayout.jsx'
import { Route, Routes, Navigate } from "react-router-dom"

function App() {
  return (
    <main className="App">
      <Routes>
        <Route exact path= "/" element={<Navigate replace to="/results"/>}></Route>
        {/* <Route path= "inputs" element={<InputLayout />} /> */}
        <Route path= "results" element={<ResultsLayout />} />
      </Routes>
    </main>
  );
}

export default App;
