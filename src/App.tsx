import { Outlet } from "react-router";
import "./App.css";

import { NavBar } from "./Components/NavBar";

function App() {
  return (
    <div className="flex flex-col w-full relative ">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
