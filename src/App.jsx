import BoostList from "./components/BoostList";
import CommonList from "./components/CommonList";
import "./App.css";
import EpicList from "./components/EpicList";

function App() {
  return (
    <div class="list-container">
      <BoostList />
      <CommonList />
      <EpicList />
    </div>
  );
}

export default App;
