// revealed is a matrix that keeps track of which cells have been revealed, a 0 in
// revealed means that it is hidden and a 1 means that it has been revealed
let [size, mines] = getSizeAndMines();
let revealed = generateRevealed(size);
let gameEnded = 0;

window.onload = function(){
  drawBoard(generateBoard(size, mines));
}

function drawBoard(board){
  let boardHtml = generateBoardhtml(board);
  document.getElementById("boardContainer").innerHTML = boardHtml;
}

// initialises the revealed matrix with zeroes everywhere
function generateRevealed(size){
  let revealed = new Array(size**2);

  for(i = 0; i < revealed.length; i++){
    revealed[i] = 0;
  }

  revealed = matricise(revealed);

  return revealed;
}

function getSizeAndMines(){
  do{
    var size = prompt("Size: ", 10);
  }while(size < 1)

  do{
    var mines = prompt("Mines: ", size);
  }while(mines < 1)

  return [size, mines];
}


// generates the html code for the board
function generateBoardhtml(board){
  let innerBoard = "";

  for(let i = 0; i < board.length; i++){
    let row_ = "<tr>";
    for(let j = 0; j < board[i].length; j++){
      if(revealed[i][j] == 0){
      row_ += `<td id="blank" onclick="squareClickHandler(this)"></td>`;
      }else switch(board[i][j]){
        case -1:
          row_ += `<td id="bomb" onclick="squareClickHandler(this)"><span class="circle"></span></td>`;
          break;
        case 0:
          row_ += `<td onclick="squareClickHandler(this)"></td>`;
          break;
        case 1:
          row_ += `<td id="blue" onclick="squareClickHandler(this)">${board[i][j]}</td>`;
          break;
        case 2:
          row_ += `<td id="green" onclick="squareClickHandler(this)">${board[i][j]}</td>`;
          break;
        case 3:
          row_ += `<td id="red" onclick="squareClickHandler(this)">${board[i][j]}</td>`;
          break;
        case 4:
          row_ += `<td id="purple" onclick="squareClickHandler(this)">${board[i][j]}</td>`;
          break;
        case 5:
          row_ += `<td id="maroon" onclick="squareClickHandler(this)">${board[i][j]}</td>`;
          break;
        case 6:
          row_ += `<td id="turquoise" onclick="squareClickHandler(this)">${board[i][j]}</td>`;
          break;
        case 7:
          row_ += `<td id="black" onclick="squareClickHandler(this)">${board[i][j]}</td>`;
          break;
        case 8:
          row_ += `<td id="grey" onclick="squareClickHandler(this)">${board[i][j]}</td>`;
          break;
      }
    }

    row_ += "</tr>";
    innerBoard += row_;
  }

  return `<table align = "center">${innerBoard}</table>`;
}

function generateBoard(size, mines){
  newBoard = new Array(size**2);

  for(let i = 0; i < mines; i++){
    newBoard[i] = -1;
    }

  newBoard = matricise(shuffle(newBoard));
  newBoard = getCellValues(newBoard);

  return newBoard;
}

// turns a 1D array into a 2D square matrix
function matricise(array){
  let matrix = [];
  let l = Math.sqrt(array.length);

  for(let i = 0; i < l; i++){
    let row = [];
    let rownr = i * l;

    for(let j = 0; j < l; j++){
      row = row.concat([array[rownr + j]]);
    }

    matrix = matrix.concat([row]);
    row = [];
  }

  return matrix;
}

// Source: https://javascript.info/task/shuffle
// shuffles an array, useful for randomizing a board
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// counts the # of bombs in the neighborhood
function getCellValues(board){
  for(i = 0; i < board.length; i++){
    for(j = 0; j < board[i].length; j++){
      if(board[i][j] == -1){
        continue;
      }else {
        board[i][j] = 0;
      }

      for(let k = -1; k <= 1; k++){
        for(let l = -1; l <= 1; l++){
          if(k == 0 && l == 0){
            continue;
          }else if(typeof board[i+k] != 'undefined' && typeof board[i+k][j+l] != 'undefined' && board[i+k][j+l] == -1){
            board[i][j] += 1;
          }
        }
      }
    }
  }
  return board;
}

function squareClickHandler(cell){
  if(gameEnded){
    return;
  }

  let col = cell.cellIndex;
  let row = cell.parentNode.rowIndex;

  if(newBoard[row][col] === -1){
    gameEnded = 1;
    alert("Game over!");
    drawEnd(newBoard);
  }else if(newBoard[row][col] === 0){
    zeroHandler(newBoard, row, col);
    drawBoard(newBoard);
    checkWin();
  }else{
    revealed[row][col] = 1;
    drawBoard(newBoard);
    checkWin();
  }
}

// draws the board after a game over
function drawEnd(board){
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
      revealed[i][j] = 1;
    }
  }
  drawBoard(board);
}

// checks whether the player has won, this is done by comparing the # of unrevealed cells to the # of mines, the player wins if these values are equal
// can probably be done a lot more efficient by keeping track of the hidden blocks during the game instead of recalculating them after every move, but I can't be bothered to code that
function checkWin(){
  let hiddenBlocks = size**2;
  for(let i = 0; i < revealed.length; i++){
    for(let j = 0; j < revealed[i].length; j++){
      if(revealed[i][j] == 1){
        hiddenBlocks -= 1;
      }
    }
  }

  if(hiddenBlocks == mines){
    gameEnded = 1;
    alert("Congratulations, you won!");
  }
}

// if the selected cell is a zero, the program then checks whether there are any other zeroes in the neighborhood and reveals them as well, this is done recursively
function zeroHandler(board, row, col){
  revealed[row][col] = 1;

// reveals borders that aren't zeroes
  for(i = -1; i <= 1; i++){
    for(j = -1; j <= 1; j++){
      if(i == 0 && j == 0){
        continue;
      }else if(typeof revealed[row+i] != 'undefined' && typeof revealed[row+i][col+j] != 'undefined' && board[row+i][col+j] != 0){
        revealed[row+i][col+j] = 1;
      }
    }
  }

  // reveals neighboring zeroes recursively, tried putting it in a for-loop, but that didn't work very well
  if(typeof revealed[row-1] != 'undefined' && board[row-1][col] == 0 && revealed[row-1][col] == 0){
    zeroHandler(board, row-1, col);
  }
  if(typeof revealed[row+1] != 'undefined' && board[row+1][col] == 0 && revealed[row+1][col] == 0){
    zeroHandler(board, row+1, col);
  }
  if(typeof revealed[row][col-1] != 'undefined' && board[row][col-1] == 0 && revealed[row][col-1] == 0){
    zeroHandler(board, row, col-1);
  }
  if(typeof revealed[row][col+1] != 'undefined' && board[row][col+1] == 0 && revealed[row][col+1] == 0){
    zeroHandler(board, row, col+1);
  }
  if(typeof revealed[row-1] != 'undefined' && typeof revealed[row-1][col-1] != 'undefined' && board[row-1][col-1] == 0 && revealed[row-1][col-1] == 0){
    zeroHandler(board, row-1, col-1);
  }
  if(typeof revealed[row-1] != 'undefined' && typeof revealed[row-1][col+1] != 'undefined' && board[row-1][col+1] == 0 && revealed[row-1][col+1] == 0){
      zeroHandler(board, row-1, col+1);
  }
  if(typeof revealed[row+1] != 'undefined' && typeof revealed[row+1][col-1] != 'undefined' && board[row+1][col-1] == 0 && revealed[row+1][col-1] == 0){
      zeroHandler(board, row+1, col-1);
  }
  if(typeof revealed[row+1] != 'undefined' && typeof revealed[row+1][col+1] != 'undefined' && board[row+1][col+1] == 0 && revealed[row+1][col+1] == 0){
      zeroHandler(board, row+1, col+1);
  }
}
