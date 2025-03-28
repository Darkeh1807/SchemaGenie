import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Projects } from "./Pages/Projects.tsx";
import { ChatBody } from "./Components/ChatBody.tsx";
import { SignIn } from "./Pages/SignIn.tsx";
import { SignUp } from "./Pages/SignUp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/projects" element={<Projects />}></Route>
          <Route path="/projects/:projectId" element={<ChatBody />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
