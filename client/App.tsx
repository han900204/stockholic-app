import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Counter } from "./components/Example";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Counter />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
