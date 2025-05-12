import { Routes, Route } from "react-router-dom";
import Smartphone from "./components/Smartphone";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Smartphone />}/>
    </Routes>
  )
}

export default App;