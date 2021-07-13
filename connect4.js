// /* Connect Four
//  Player 1 and 2 alternate turns. On each turn, a piece is dropped down a column until a player gets four-in-a-row (horiz, vert, or diag) or until board fills (tie)
//  */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

// /** makeBoard: create in-JS board structure:
//  *    board = array of rows, each row is array of cells  (board[y][x])
//  */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++){
    board.push(Array.from({ length: WIDTH }));
    // **<<JARED's Notes>>** So, from what I gathered, the Array.from is taking an 'empty' object, that has the 'length' property set to the value of WIDTH. I think. 
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const board = document.getElementById('board');

  // TODO: add comment for this code
  // **<<JARED's Notes>>** This code appears to be creating a table row element, setting it's id to be 'column-top', and adding an eventlistener for clicks. This must be the clickable area at the top of the board.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // **<<JARED's Notes>>** This is doing something similar, adding the table data cells in, and giving them an id of 'x', which seems like it should be more specific, and appending this new cell to the first cell created, if there is one. 
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  board.append(top);

  // TODO: add comment for this code
  //**<<JARED's Notes>>** This is complicated. From what I can tell, this is creating the elements for each 'circle' of the game board, and that board has already been created with empty arrays and null values. Now, we're filling those arrays?
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  // **<<JARED's Notes>>** This is iterating 'down' the selected column, starting from the bottom, and working its way up. If the counter in the for loop hits an 'empty' spot, (the value of the array index is falsy), it returns that array index, so that the function calling it knows where the top 'empty' spot is. 
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  // **<<JARED's Notes>>** I peeked at the solution here, and just copied it over. I would never have come close to some of this. Is that an inline style, in Javascript? piece.style.top? I have no knowledge of what that is. 
  const piece = document.createElement('div'); //Got this on my own. 
  piece.classList.add('piece'); // Makes sense.
  piece.classList.add(`p${currPlayer}`); // Fancier than I would have done, but also makes sense. 
  piece.style.top = -50 * (y + 2); //What is this?

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  // **<<JARED's Notes>>** Hey, I know this one!
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);


  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  // **<<JARED's Notes>>** So, those are arrow functions? Stripped down to almost nothing? Or is that another method/function involving arrows?
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  // **<<JARED's Notes>>** My version:
  // if (currPlayer === 1) {
  //   currPlayer = 2;
  // }
  // else {currPlayer = 1}
  
  // Their version.
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    
    return cells.every(
      // **<<JARED's NOTES>>** Optional / Further Study; add notes to explain this. 
      // So. This is an arrow function, that takes the parameters x and y. It is then checking if those parameters are greater than or equal to 0, AND less than the height and width. And if the board, at those coordiantes, equals the current player. How this translates out, I do not know. 
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // <Laughs> Yeah, that's what I've been doing the whole time. Glad we're on the same page... <cries>
  // **<<JARED's NOTES>>** So confused on this. This isn't checking any pieces, it's checking entire rows and columns? And what are the const arrays actually doing? They're not being referenced, to my knowledge, and this is just creating arrays with values in them. Would they evaluate to true or false?

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
