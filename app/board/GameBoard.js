import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

import CheckerPiece from "./CheckerPiece";
import GameBar from "../toolBars/GameBar";

function GameBoard({ route }) {
  const serverAddr = route.params.serverAddr;
  console.log(serverAddr);

  const defaultBoard = () => {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    for (let i = 1; i <= 6; i++) {
      board[0][i] = "B";
      board[7][i] = "B";
      board[i][0] = "W";
      board[i][7] = "W";
    }

    return board;
  };

  const [selected, setSelected] = useState([-1, -1]);
  const [availableMoves, setAvailableMoves] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("human");
  const [currentStatus, setCurrentStatus] = useState(
    "Your turn. Select a black piece.",
  );
  const [board, setBoard] = useState(defaultBoard);
  const [movePath, setMovePath] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const resetState = () => {
    setSelected([-1, -1]);
    setAvailableMoves([]);
    setCurrentPlayer("human");
    setCurrentStatus("Your turn. Select a black piece.");
    setBoard(defaultBoard);
    setMovePath([]);
    setGameOver(false);
  };

  const computerMovePath = (newBoard) => {
    newBoard.forEach((r, rIndex) =>
      r.forEach((c, cIndex) => {
        if (c !== board[rIndex][cIndex]) movePath.push([rIndex, cIndex]);
      }),
    );
    return movePath;
  };

  useEffect(() => {
    const fetchResult = async () => {
      const winner = await fetch(`${serverAddr}/api/checkResult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board: board,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          return json.winner;
        });

      return winner;
    };

    const checkResult = async () => {
      const winner = await fetchResult();

      switch (winner) {
        case "none":
          return false;
        case "B":
          setCurrentStatus("You won!");
          setGameOver(true);
          break;
        case "W":
          setCurrentStatus("Computer won!");
          setGameOver(true);
          break;
        case "tie":
          setCurrentStatus("It's a tie!");
          setGameOver(true);
          break;
      }

      return true;
    };

    const computerMakeMove = async () => {
      if (await checkResult()) {
        setCurrentPlayer("human");
        return;
      }

      setCurrentStatus("Computer is thinking...");
      const newBoard = await fetch(`${serverAddr}/api/computerMove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board: board,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          return json.board;
        });

      setMovePath(computerMovePath(newBoard));
      setBoard(newBoard);
      setCurrentPlayer("human");
      setCurrentStatus("Your turn. Select a black piece.");
    };

    if (currentPlayer === "computer") {
      computerMakeMove();
    } else if (currentPlayer === "human") {
      checkResult();
    }
  }, [currentPlayer]);

  const [selectedRow, selectedCol] = selected;

  const getAvailableMoves = async (r, c) => {
    const possibleMoves = await fetch(`${serverAddr}/api/getPossibleMoves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board: board,
        row: r,
        col: c,
        playerColor: "B",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        return json.possibleMoves;
      });

    return possibleMoves;
  };

  const handleSelect = async (r, c) => {
    if (selectedRow === r && selectedCol === c) {
      setSelected([-1, -1]);
      setAvailableMoves([]);
      setCurrentStatus("Your turn. Select a black piece.");
    } else if (selectedRow === -1 && selectedCol === -1) {
      if (board[r][c] === "B") {
        setAvailableMoves(await getAvailableMoves(r, c));
        setSelected([r, c]);
        setCurrentStatus("Your turn. Make a move.");
      }
    } else {
      if (fieldInAvailableMoves(r, c)) {
        board[r][c] = board[selectedRow][selectedCol];
        board[selectedRow][selectedCol] = null;
        setMovePath([]);
        setSelected([-1, -1]);
        setAvailableMoves([]);
        setCurrentPlayer("computer");
      }
    }
  };

  const fieldInAvailableMoves = (r, c) => {
    for (let i = 0; i < availableMoves.length; ++i) {
      if (r === availableMoves[i][0] && c === availableMoves[i][1]) {
        return true;
      }
    }
    return false;
  };

  const fieldInMovePath = (r, c) => {
    if (movePath) {
      for (let i = 0; i < movePath.length; ++i) {
        if (r === movePath[i][0] && c === movePath[i][1]) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <GameBar resetFunction={resetState} currentPlayer={currentPlayer} />
      {board.map((row, rIndex) => (
        <View key={rIndex} style={styles.row}>
          {row.map((field, cIndex) => (
            <Pressable
              key={cIndex}
              onPress={
                currentPlayer === "human" && !gameOver
                  ? () => handleSelect(rIndex, cIndex)
                  : null
              }
            >
              <CheckerPiece
                color={
                  field === null ? "empty" : field === "B" ? "black" : "white"
                }
                selected={
                  selected[0] === rIndex && selected[1] === cIndex
                    ? true
                    : false
                }
                inMovePath={fieldInMovePath(rIndex, cIndex)}
                isAvailableToMove={fieldInAvailableMoves(rIndex, cIndex)}
              />
            </Pressable>
          ))}
        </View>
      ))}
      <View style={{ backgroundColor: "lightgreen" }}>
        <Text>{currentStatus}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
  },
  row: {
    flexDirection: "row",
  },
});

export default GameBoard;
