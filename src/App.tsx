import "./App.css";
import { Main } from "./Components/Main";
import { NavBar } from "./Components/NavBar";
import { TextBox } from "./Components/TextBox";
function App() {
  return (
    <div className="flex flex-col h-screen relative items-center">
      <NavBar />
      <Main />
      <TextBox />
    </div>
  );
}

export default App;
