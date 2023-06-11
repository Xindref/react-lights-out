import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    // creates an array of arrays using the row, column, and chance props
    const initialBoard = Array.from({ length: nrows }, () =>
      Array.from({ length: ncols }, () => Math.random() < chanceLightStartsOn)
    );

    // return initial board to render
    return initialBoard;
  }

  function hasWon() {
    // if every cell in the board is false, you win
    return board.every(row => row.every(cell => !cell));
  }

  function flipCellsAround(coord) {
    // sets what our board looks like right now
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // makes new copy of board using oldBoard
      const boardCopy = oldBoard.map(row => [...row]);

      // flips all the adjacent cells of where we click
      flipCell(y, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);

      // return the new board to render
      return boardCopy;
    });
  }

  if (hasWon()) {
    // if we win, only render "You won!"
    return <div className="Board-win">You won!</div>;
  }

  // this is the table for our game, maps over board to generate
  const table = board.map((row, y) => (
    // set key as Y coord for every row we map to our board
    <tr key={y}>
      {row.map((cell, x) => {
        const coord = `${y}-${x}`;
        return (
          // for each cell we key the coord it is at on the board
          // and pass through our props and function to flip cells
          <Cell
            key={coord}
            isLit={cell}
            flipCellsAroundMe={() => flipCellsAround(coord)}
          />
        );
      })}
    </tr>
  ));

  return (
    // return our table to render out our inital game
    <table className="Board">
      <tbody>{table}</tbody>
    </table>
  );
}

export default Board;
