import { Outlet } from "react-router";
import "./App.css";

import { NavBar } from "./Components/NavBar";

function App() {
  return (
    <div className="flex flex-col h-screen relative items-center">
      <NavBar />
      <Outlet />
      {/* <Main />
      <TextBox /> */}
    </div>
  );
}

export default App;
