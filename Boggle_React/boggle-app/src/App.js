import logo from './logo.png';
import findAllSolutions from './boggle_solver.js';
import {LoginButton,LogoutButton} from './Authentication.js';
import Board from './Board.js';
import GuessInput from './GuessInput.js';
import FoundSolutions from './FoundSolutions.js';
import SummaryResults from './SummaryResults.js';
import ToggleGameState from './ToggleGameState.js';
import React, { useState, useEffect } from 'react';
import {GAME_STATE} from './GameState.js';
import {RandomGrid} from './randomGen.js';
import './App.css';
import UserResponses from './UserResponses.js'
import firebase from "./firebase.js"
import TextInput from './TextInput.js';



  // useEffect will trigger when the array items in the second argument are
  // updated so whenever grid is updated, we will recompute the solutions

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allSolutions, setAllSolutions] = useState([]);  // solutions from solver
  const [foundSolutions, setFoundSolutions] = useState([]);  // found by user
  const [gameState, setGameState] = useState(GAME_STATE.BEFORE); // Just an enuerator or the three states see below
  const [grid, setGrid] = useState([]);   // the grid
  const [totalTime, setTotalTime] = useState(0);  // total time elapsed
  const [size, setSize] = useState(3);  // selected grid size

  useEffect(() => {
    const wordList = require('./full-wordlist.json');
    let tmpAllSolutions = findAllSolutions(grid, wordList.words);
    setAllSolutions(tmpAllSolutions);
  }, [grid]);

  // This will run when gameState changes.
  // When a new game is started, generate a new random grid and reset solutions
  useEffect(() => {
    if (gameState === GAME_STATE.IN_PROGRESS) {
      if(size !== -11111)  // if Grid is not loaded from firestore
          setGrid(RandomGrid(size));
      setFoundSolutions([]);
    }
  }, [gameState, size]);

  function correctAnswerFound(answer) {
    console.log("New correct answer:" + answer);
    setFoundSolutions([...foundSolutions, answer]);
  }
  return (
      <div className="App">
        <img src={logo} width="200" height="200" className="App-logo" alt="Boggle Logo" />
        {currentUser ? (
          <div>
            <LogoutButton setCurrentUser={setCurrentUser}/>
            <ToggleGameState gameState={gameState}
              setGameState={(state) => setGameState(state)}
              setSize={(state) => setSize(state)}
              setTotalTime={(state) => setTotalTime(state)}
              numFound={foundSolutions.length}
              theGrid={JSON.stringify(grid)}
              setGrid={(state) => setGrid(state)}
              user={currentUser}/> 
  
            { gameState === GAME_STATE.IN_PROGRESS &&
              <div>
                <Board board={grid} />
                <GuessInput allSolutions={allSolutions}
                  foundSolutions={foundSolutions}
                  correctAnswerCallback={(answer) => correctAnswerFound(answer)}/>
                <FoundSolutions headerText="Solutions you've found" words={foundSolutions} />
              </div>
            }
  
            { gameState === GAME_STATE.ENDED &&
              <div>
                <Board board={grid} />
                <SummaryResults words={foundSolutions} totalTime={totalTime} />
                <FoundSolutions headerText="Missed Words [wordsize > 3]: " words={allSolutions}  />
              </div>
            }
          </div>
        ) : (
          <LoginButton setCurrentUser={(user) => setCurrentUser(user)} />
        )}
      </div>
    );
  }
  
  export default App;
  