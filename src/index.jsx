import ReactDOM from "react-dom/client";
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // Use BrowserRouter if needed
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);