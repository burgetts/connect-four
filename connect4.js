/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let currPlayer = 1;  // active player: 1 or 2

let board = [];     // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  board.push(...Array(HEIGHT).fill().map(() => Array(WIDTH).fill(null))) // creates empty HEIGHT x WIDTH matrix
  currPlayer = 1; // reset currPlayer at the beginning of each round
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  
  const htmlBoard = document.getElementById('board')  

  // Column top row
  const top = document.createElement("tr"); // create clickable row on top of columns
  top.setAttribute("id", "column-top");   
  top.addEventListener("click", handleClick); 
  

  // Column top cells
  for (let x = 0; x < WIDTH; x++) {         // create top cells and append them to top
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Rest of board
  for (let y = 0; y < HEIGHT; y++) {        // create each row for cells
    const row = document.createElement("tr"); 
    for (let x = 0; x < WIDTH; x++) {       // create and append each cell in previously created row
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`); // set location of cell as ID
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if column is filled) */
function findSpotForCol(x) {
  for (let y = HEIGHT-1; y >= 0; y--){
    if (board[y][x] === null){
      return y
    }
  }
  return null
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const playedPiece = document.createElement("div")             // create piece with correct current player
  playedPiece.setAttribute("class", `piece p${currPlayer}`) 
  const playedPieceCell = document.getElementById(`${y}-${x}`) // find and append to correct cell
  playedPieceCell.append(playedPiece)
}

/** endGame: announce game end */
function endGame(msg) {
  setTimeout(function () {alert(msg)}, 150) // allows last piece to appear before alert
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
   
  let x = +evt.target.id;      // get x from ID of clicked cell

  let y = findSpotForCol(x);  // get next spot in column (if none, ignore click)
  if (y === null) {
    return;
  }

  board[y][x] = currPlayer;  // update in-memory board with player
  placeInTable(y, x);       // place piece in board and add to HTML table

// Check for win
  if (checkForWin()) {  
    // Fills in-memory board with zeros to prevent further gameplay after a win
    for (let y = HEIGHT-1; y >= 0; y--){  
      board.pop()
    } 
    board.push(...Array(HEIGHT).fill().map(() => Array(WIDTH).fill(0)))
    return endGame(`Player ${currPlayer} wins!`);
  }

// Check for tie
  if (board.every((row) => row.every((cell) => ((cell === 1) || (cell ==2))))) {
   return endGame(`It's a tie!`)
  }

// Switch players
  currPlayer = (currPlayer === 1) ? 2 : 1

// Switch color of head cells
  headCells = document.querySelectorAll('#column-top td')
if (currPlayer ===1 ){
  headCells.forEach(headCell => headCell.classList.remove('p2Top'))
  headCells.forEach(headCell => headCell.classList.add('p1Top'))
}
 else if (currPlayer === 2){
    headCells.forEach(headCell => headCell.classList.remove('p1Top'))
    headCells.forEach(headCell => headCell.classList.add('p2Top'))
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer // all 4 cells populated by same player
    );
  }

  // Checks coordinates in each direction for each [y][x] and determines which player, if any, is there
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

/** Resets top cell colors to player1 */
function resetTopClassNames() {
  headCells = document.querySelectorAll('#column-top td')
  headCells.forEach(headCell => headCell.classList.add('p1Top'))
  headCells.forEach(headCell => headCell.classList.remove('p2Top'))
}

// Restart button
restartBtn = document.querySelector('button')
restartBtn.addEventListener('click', function () {
  // reset in-memory board
  for (let y = HEIGHT-1; y >= 0; y--){  
    board.pop()
  } 
  makeBoard()
  // remove all pieces and reset colors
  pieces = document.querySelectorAll(".piece")
  pieces.forEach(piece => piece.remove())
  resetTopClassNames()
})

makeBoard()
makeHtmlBoard();
resetTopClassNames()