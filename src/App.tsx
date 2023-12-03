import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import IncendentReportForm from './components/IncedentReportForm';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <IncendentReportForm />
    </div>
  );
}

export default App;
