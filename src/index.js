import React from 'react';
import './index.css';
import App from "./App";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);