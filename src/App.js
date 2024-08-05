import logo from './logo.svg';
import InputLayout from './pages/InputLayout.jsx'
import ResultsLayout from './pages/ResultsLayout.jsx'
import { Route, Routes, Navigate } from "react-router-dom"
import { InputProvider } from './components/InputContext'
import { ResultsProvider} from './components/ResultsContext'

function App() {
  return (
    <main className="App">
      <InputProvider>
      <ResultsProvider> 
      <Routes>
        <Route exact path= "/" element={<Navigate replace to="/results"/>}></Route>
        {/* <Route path= "inputs" element={<InputLayout />} /> */}
        <Route path= "results" element={<ResultsLayout />} />
      </Routes>
      </ResultsProvider>
      </InputProvider>
    </main>
  );
}

export default App;
