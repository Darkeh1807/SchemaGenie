import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Projects } from "./Components/Projects.tsx";
import { ChatBody } from "./Components/ChatBody.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Projects />}></Route>
          <Route path="/projects/:projectId" element={<ChatBody />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
