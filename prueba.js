/*Añadir un mensaje de exito cuando acabe el juego,
//añadir tiempo,
//añadir que tengo maximo 5 oportunidades
// Añadir mensajes de exito o motivacion en los laterales al estilo piano tiles
*/

let numSelected = null;
let tileSelected = null;
let errors = 0;

const board = [
    [5, 3, "-", "-", 7, "-", "-", "-", "-"],
    [6, "-", "-", 1, 9, 5, "-", "-", "-"],
    ["-", 9, 8, "-", "-", "-", "-", 6, "-"],
    [8, "-", "-", "-", 6, "-", "-", "-", 3],
    [4, "-", "-", 8,"-", 3,"-", "-", 1],
    [7, "-", "-", "-", 2, "-", "-", "-", 6],
    ["-", 6, "-", "-", "-", "-", 2, 8, "-"],
    ["-", "-", "-", 4, 1, 9, "-", "-", 5],
    ["-", "-", "-", "-", 8, "-", "-", 7, 9]
  ];
  

function solveSudoku(board) {
  const size = 9;
  const emptyCell = findEmptyCell(board);

  if (!emptyCell) {
    // Caso base: se resolvió todo el tablero, retornamos verdadero
    return true;
  }

  const [row, col] = emptyCell;

  for (let num = 1; num <= size; num++) {
    if (isValidMove(board, row, col, num)) {
      board[row][col] = num;

      if (solveSudoku(board)) {
        // Llamada recursiva
        return true;
      }

      // Si la llamada recursiva no retorna verdadero, deshacemos el movimiento
      board[row][col] = "-";
    }
  }

  // Si no se encuentra ninguna solución, retornamos falso
  return false;
}

function findEmptyCell(board) {
  const size = 9;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === "-") {
        return [row, col];
      }
    }
  }

  return null; // Si no hay celdas vacías, retornamos null
}

function isValidMove(board, row, col, num) {
  return (
    isRowValid(board, row, num) &&
    isColValid(board, col, num) &&
    isBoxValid(board, row - (row % 3), col - (col % 3), num)
  );
}

function isRowValid(board, row, num) {
  const size = 9;

  for (let col = 0; col < size; col++) {
    if (board[row][col] === num) {
      return false;
    }
  }

  return true;
}

function isColValid(board, col, num) {
  const size = 9;

  for (let row = 0; row < size; row++) {
    if (board[row][col] === num) {
      return false;
    }
  }

  return true;
}

function isBoxValid(board, startRow, startCol, num) {
  const size = 3;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[startRow + row][startCol + col] === num) {
        return false;
      }
    }
  }

  return true;
}

const solution = JSON.parse(JSON.stringify(board)); // Copia el tablero original


window.onload = function() {
  setGame();
  solveSudoku(solution); // Resuelve el Sudoku
  
}


function showSolution() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const tileId = r.toString() + "-" + c.toString();
      const tile = document.getElementById(tileId);

      tile.innerText = solution[r][c]; // Actualiza el contenido del elemento en el DOM
      //tile.classList.remove("tile-start"); // Quita la clase "tile-start"
     
    }
  }
}

function setGame() 
{
    // Digits 1-9 in the bottom of the page
    
    for (let i = 1; i <= 9; i++) 
    {
        
        let number = document.createElement("div");
        number.id = i
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Generate the Board 9x9 on the middle of the screen
    
    for (let r = 0; r < 9; r++) 
    {
        for (let c = 0; c < 9; c++) 
        {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();

            if (board[r][c] != "-") 
            {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }

            if (r == 2 || r == 5) 
            {
                tile.classList.add("horizontal-line");
            }

            if (c == 2 || c == 5) 
            {
                tile.classList.add("vertical-line");
            }

            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber()
{
    if (numSelected != null) 
    {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function showError(tile) {
    tile.classList.add("error");
    setTimeout(function() {
        tile.classList.remove("error");
    }, 1000);
}

function selectTile() 
{
    if (numSelected) 
    {
        if (this.innerText != "") 
        {
            return;
        }

        // "0-0" "0-1" .. "3-1"
        let coords = this.id.split("-"); //["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) 
        {
            this.innerText = numSelected.id;
        }
        else 
        {
            errors += 1;
            // Show the incorrect tile in red color
            document.getElementById("errors").innerText = errors;
            showError(this);

            // Assigns to a error counter a red background-color and 2 seconds of animation
            setTimeout(() => document.getElementById("errors").style.background = "red", 0);
            setTimeout(() => document.getElementById("errors").style.background = "rgb(183, 235, 255)", 2000);


            const element = document.querySelector('#errors');
            element.classList.add('animate__animated', 'animate__jello');
            element.style.setProperty('--animate-duration', '2s');

            element.addEventListener('animationend', () => 
            {
                element.classList.remove('animate__jello');

            });

            setTimeout(() => 
            {
                element.classList.add('animate__jello');
            }), 2000; // Duration of the new animation when you do a error in the same o new tile.



            document.getElementById("errors").innerText = errors;
        }
    }
}
