import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';


const rowStyle = {
  display: 'flex'
}

const squareStyle = {
  'width': '60px',
  'height': '60px',
  'backgroundColor': '#ddd',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '20px',
  'color': 'white'
}

const boardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid'
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column'
}

const instructionsStyle = {
  'marginTop': '5px',
  'marginBottom': '5px',
  'fontWeight': 'bold',
  'fontSize': '16px',
}

const buttonStyle = {
  'marginTop': '15px',
  'marginBottom': '16px',
  'width': '80px',
  'height': '40px',
  'backgroundColor': '#8acaca',
  'color': 'white',
  'fontSize': '16px',
}

function Square({ gameEnded, reset, setReset, squareValue, changePlayer, currentPlayer, changeGameState }) {

  //the player is the same as the value displayed for now
  const [value, setValue] = useState("");
  //detemines if the field is already in use or not, so it can t be changed

  const [fieldTaken, setFieldTaken] = useState(false);

  const clickHandler = () => {

    //checks if field is taken, if field is taken clicking shall not change the player 
    if (!fieldTaken) {
      setValue(currentPlayer);
      setFieldTaken(true);
      changePlayer();
      //and stores the new game state  
      changeGameState(squareValue);
    }

  };

  useEffect(() => {
    if (reset) {
      setReset(false),
        setValue(""),
        setFieldTaken(false)
      //console.log("Triggerede effekt")

    }
  }, [reset, setReset, setValue, setFieldTaken])

  useEffect(() => {
    if (gameEnded) {
      setFieldTaken(true)
    }
  },
    [gameEnded])

  return (
    <div
      className="square"
      onClick={clickHandler}
      style={squareStyle}>
      {value ?
        <p>{value}</p>
        : null

      }

    </div>
  );
}



function Board() {

  const [reset, setReset] = useState(false);

  const [currentPlayer, setCurrentPlayer] = useState("X");
  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };
  //stores all marked fields as x, y, player who placed his letter
  //used to determinate the winner of the game
  const [gameState, setGameState] = useState([]);
  const changeGameState = (value) => {
    setGameState(gameState => [...gameState, { y: value[0], x: value[1], player: currentPlayer }].sort(),
    )
  };
  const [gameWinner, setGameWinner] = useState("No one won yet");

  const [gameEnded, setGameEnded] = useState(false);

//used to reset the game
  useEffect(() => {
    if (reset) {
      setGameWinner("No one won yet"),
        setGameState([]),
        setCurrentPlayer("X")
      setGameEnded(false)
    }
  }, [reset, setReset]);

//used to determinate the winner
  useEffect(() => {
    //you need to make at least five moves to win the game
    if (gameState.length > 4) {
      gameLogic()
    }
    if (gameState.length === 9 && gameWinner === "No one won yet") {
      console.log("draw"),
      setGameWinner("Draw")
      setGameEnded(true)
    }
  }, [gameState, setGameState]);


  //just to make the code easier to read
  const generateSquares = (coordinations) => {

    return (
      <Square
        reset={reset}
        setReset={setReset}
        gameEnded={gameEnded}
        changeGameState={changeGameState}
        squareValue={coordinations}
        changePlayer={changePlayer}
        currentPlayer={currentPlayer} />
    )
  };

  //here is the logic to determinate if a player won 
  //and make the fields not be able to click anymore
  //can be done in one loop

  // can be change for less lines
  const gameLogic = () => {
    //check vertically for winner
    for (let i = 0; i <= 2; i++) {
      if ((gameState.filter(({ y, player }) => y == i && player == "X").length === 3)) {
        setGameWinner("X")
        setGameEnded(true)
      }
      if ((gameState.filter(({ y, player }) => y == i && player == "O").length === 3)) {
        setGameWinner("O")
        setGameEnded(true)

      }
    }
    //check horizontally for winner
    for (let j = 0; j <= 2; j++) {
      if ((gameState.filter(({ x, player }) => x == j && player == "X").length === 3)) {
        setGameWinner("X")
        setGameEnded(true)
      }
      if ((gameState.filter(({ x, player }) => x == j && player == "O").length === 3)) {
        setGameWinner("O")
        setGameEnded(true)
      }
    }


//check from left bottom to right top
    if ((gameState.find(({ x, y, player }) => x === 0 && y === 0 && player === "X"))
      && (gameState.find(({ x, y, player }) => x === 1 && y === 1 && player === "X"))
      && (gameState.find(({ x, y, player }) => x === 2 && y === 2 && player === "X"))) {
      setGameWinner("X")
      console.log("X")
      setGameEnded(true)
    }

    if ((gameState.find(({ x, y, player }) => x === 0 && y === 0 && player === "O"))
      && (gameState.find(({ x, y, player }) => x === 1 && y == 1 && player === "O"))
      && (gameState.find(({ x, y, player }) => x === 2 && y === 2 && player === "O"))) {
      setGameWinner("O")
      setGameEnded(true)
    }
//check from left top to right bottom
    if ((gameState.find(({ x, y, player }) => x === 2 && y === 0 && player === "X"))
      && (gameState.find(({ x, y, player }) => x === 1 && y === 1 && player === "X"))
      && (gameState.find(({ x, y, player }) => x === 0 && y === 2 && player === "X"))) {
      setGameWinner("X")
      setGameEnded(true)
    }

     if ((gameState.find(({ x, y, player }) => x === 2 && y === 0 && player === "O"))
      && (gameState.find(({ x, y, player }) => x === 1 && y === 1 && player === "O"))
      && (gameState.find(({ x, y, player }) => x === 0 && y === 2 && player === "O"))) {
      setGameWinner("O")
      setGameEnded(true)
    }

  }


  return (
    <div style={containerStyle} className="gameBoard">
      <div id="statusArea" className="status" style={instructionsStyle}>
        {gameEnded ?
          <span>Press reset to start a new game</span> :
          <span> Next player {currentPlayer}</span>
        }</div>
      <div id="winnerArea" className="winner" style={instructionsStyle}>Winner: <span>{gameWinner}</span></div>
      <button onClick={() => setReset(true)} style={buttonStyle}>Reset</button>
      <div style={boardStyle}>
        <div className="board-row" style={rowStyle}>
          {/* here a function to genearate the squares */}
          {generateSquares([2, 0])}
          {generateSquares([2, 1])}
          {generateSquares([2, 2])}
        </div>
        <div className="board-row" style={rowStyle}>
          {generateSquares([1, 0])}
          {generateSquares([1, 1])}
          {generateSquares([1, 2])}
        </div>
        <div className="board-row" style={rowStyle}>
          {generateSquares([0, 0])}
          {generateSquares([0, 1])}
          {generateSquares([0, 2])}
        </div>


      </div>
    </div>
  );
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);