import { useContext } from "react";
import "./App.css";
import Game from "./components/Game";
import GamePvsC from "./components/CovekVsComp";
import GameCvsC from "./components/CompVsComp";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import { MyContext } from "./context/MyContext";

function App() {
  const { seeButtons, seeButtonsFunction, difficulty, gameDifficultyFunction } = useContext(MyContext);
  const ButtonClick = (b) => {
    console.log(difficulty);
    seeButtonsFunction();
  };
  const difficultyChosing = (a) => {
    gameDifficultyFunction(a.target.value);
  };
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/IGRICA" element={<Game />} />
      </Routes>

      {seeButtons && (
        <div className="buttonsContainer">
          <div className="backgroundImage"></div>
          <div>
            <h1> 9 Man Morris</h1>
            <br></br>
           
          </div>
          <div className="buttonsGroup">
            
            <Link to="/IGRICA">
              <button className="dugmici" onClick={ButtonClick}>
              Igrac vs Igrac 
              </button>
            </Link>
            {/* <Link to="/gamePvsC">
              <button className="dugmici" onClick={ButtonClick}>
             Igrac vs Comp
              </button>
            </Link> */}
            {/* <Link to="/gameCvsC">
              <button className="dugmici" onClick={ButtonClick}>
                Computer vs Computer
              </button>
            </Link> */}
            
            
          </div>
          {/* <select onChange={difficultyChosing}>
              <option value={"easy"}>Easy</option>
              <option value={"medium"}>Medium</option>
              <option value={"hard"}>Hard</option>
            </select> */}
        </div>
        
      )}
    </BrowserRouter>
  );
}

export default App;
