import { createContext, useState } from "react";

export const MyContext = createContext({
  seeButtons: true,
  seeButtonsFunctions: () => {},
  gameDifficultyFunction: (a) => {},
});

export const MyContextProvider = (props) => {
  const [seeButtons, setSeeButtons] = useState(true);
  const [difficulty, setDifficulty] = useState("easy");
  const seeButtonsFunction = () => {
    setSeeButtons(!seeButtons);
  };

  const gameDifficultyFunction = (a) => {
    setDifficulty(a);
  };
  return (
    <MyContext.Provider
      value={{
        seeButtons,
        difficulty,
        gameDifficultyFunction,
        seeButtonsFunction,
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};
