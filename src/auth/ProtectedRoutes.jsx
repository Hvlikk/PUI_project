import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import NotFound from '../pages/NotFound/NotFound';

export default function ProtectedRoutes() {
  return (
    <Routes>
      {/* Prywatne trasy dostępne tylko po zalogowaniu */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Strona 404, która będzie widoczna w przypadku niepoprawnej ścieżki */}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
}
