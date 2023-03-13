import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CalendarView from './views/CalendarView';
import AuthView from './views/AuthView';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CalendarView />} />
        <Route path="auth" element={<AuthView />} />
      </Routes>
    </div>
  );
}

export default App;
