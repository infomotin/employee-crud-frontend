import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeList from "./components/EmployeeList";
import EmployeeCreate from "./components/EmployeeCreate";
import EmployeeEdit from "./components/EmployeeEdit";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <div className="container mx-auto py-10 px-4">
          <Routes>
            <Route path="/" element={<EmployeeList />} />
            <Route path="/create" element={<EmployeeCreate />} />
            <Route path="/edit/:id" element={<EmployeeEdit />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
