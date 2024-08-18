import logo from './logo.svg';
import InputLayout from './pages/InputLayout.jsx'
import ResultsLayout from './pages/ResultsLayout.jsx'
import BookingLayout from './pages/BookingLayout';
import { Route, Routes, Navigate } from "react-router-dom"
import { InputProvider } from './components/InputContext'
import { ResultsProvider} from './components/ResultsContext'
import { BookingProvider } from './components/BookingContext';
import { MutexProvider } from './components/MutexContext.js'

function App() {
  return (
    <main className="App">
      <MutexProvider>
      <BookingProvider>
      <InputProvider>
      <ResultsProvider> 
      <Routes>
        <Route exact path= "/" element={<Navigate replace to="/results"/>}></Route>
        {/* <Route path= "inputs" element={<InputLayout />} /> */}
        <Route path= "results" element={<ResultsLayout />} />
        <Route path= "confirmation" element={<BookingLayout />} />
      </Routes>
      </ResultsProvider>
      </InputProvider>
      </BookingProvider>
      </MutexProvider>
    </main>
  );
}

export default App;
