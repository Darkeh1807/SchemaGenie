import "./App.css";
import { Main } from "./Components/Main";
import { NavBar } from "./Components/NavBar";
import { SearchBarSection } from "./Components/SearchBarSection";
function App() {
  return (
    <div className="flex flex-col h-screen relative items-center">
      <NavBar />
      <Main />
      <SearchBarSection />
    </div>
  );
}

export default App;
