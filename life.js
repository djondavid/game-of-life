import data from "./life-data/queen-bee.js";

// Globals
const ROWS = 30; // number of rows (vertically on the "y" axis)
const COLS = 30; // number of columns (horizontally on the "x" axis)
const grid_y_size = data.rows > ROWS ? data.rows : ROWS; // grid height ("y")
const grid_x_size = data.cols > COLS ? data.cols : COLS; // grid width ("x")

let grid;
let nextGrid;

const generations = data.generations || 1200;
const delay = 120; // ms

// Create a new 2D array at the grid y & x sizes
function make2DArray() {
  let arr = new Array(grid_y_size);
  for (let i = 0; i < grid_y_size; i++) {
    arr[i] = new Array(grid_x_size);
  }
  return arr;
}

// Init all cells in the grid
function initGrid() {
  grid = make2DArray();

  /* Random method
  // const mux = 9
  // const mod = 12;
  // for (let y = 0; y < grid_y_size; y++) {
  //   for (let x = 0; x < grid_x_size; x++) {
  //     let r = Math.floor(Math.random() * mux);
  //     grid[y][x] = (r % mod == 0 ? 1 : 0);
  //   }
  // } 
  */

  // From data file
  if (data?.rows <= grid_y_size && data?.cols <= grid_x_size) {
    for (let y = 0; y < grid_y_size; y++) {
      for (let x = 0; x < grid_x_size; x++) {
        // console.log("Initializing grid ["+ y +"]["+ x +"]")
        if (x < data?.cols && y < data?.rows) {
          grid[y][x] = data.gridInit[y][x];
        } else {
          grid[y][x] = 0;
        }
      }
    }
  } else {
    console.warn("The data grid size exceeds game grid size!");
  }
}

/**
 * sum all the alive cells in the 9 cell neighborhood of the (passed) center cell
 * (including the center cell's state). If the sum of alive cells is:
 *    3: the cell will become or stay alive
 *    4: the cell state will be unchanged
 *    all other sums: the cell will die
 */
const checkNeighborhood = (yCell, xCell) => {
  // console.log("Checking neighborhood for cell [" + yCell + "][" + xCell + "]");

  // init neighborhood alive sum with the inner cell's state
  let sum = grid[yCell][xCell] ? 1 : 0;

  // get all 8 neighbor cells and add any alive cells to the sum
  const yOffsets = [-1, -1, -1, 0, 0, 1, 1, 1];
  const xOffsets = [-1, 0, 1, -1, 1, -1, 0, 1];
  for (let i = 0; i < 8; i++) {
    let yCoord = yCell + yOffsets[i];
    let xCoord = xCell + xOffsets[i];
    // console.log("Neighbor coord [" + yCoord + "][" + xCoord + "]");

    // if the Coord is beyond the size of the grid, wrap it around to the opposite side(s)
    if (yCoord < 0) {
      yCoord += grid_y_size;
    }
    if (yCoord > grid_y_size - 1) {
      yCoord -= grid_y_size;
    }
    if (xCoord < 0) {
      xCoord += grid_x_size;
    }
    if (xCoord > grid_x_size - 1) {
      xCoord -= grid_x_size;
    }
    // console.log("Neighbor cell [" + yCoord + "][" + xCoord + "]");

    // add any alive neighbors to the sum
    sum += grid[yCoord][xCoord] ? 1 : 0;

    /* --OR-- if the Coord is beyond the size of the grid, just don't sum it (only sum cells in the grid)
    if (xCoord >= 0 && xCoord < grid_x_size) {
      if (yCoord >= 0 && yCoord < grid_y_size) {
        // console.log("Checking Neighbor cell [" + xCoord + ", " + yCoord + "]");
        sum += grid[yCoord][xCoord] ? 1 : 0; // the value should be sufficient, but making sure its a 1 or 0, not a boolean
      }
    }
    */
  }

  // the cell will stay or become dead by default
  let nextState = 0;
  // if the sum is 3 the next state will be alive
  if (sum === 3) {
    nextState = 1;
  }
  // if the sum is 4 the next state will be the same as the current state
  else if (sum === 4) {
    nextState = grid[yCell][xCell] ? 1 : 0;
  }
  // console.log("Next state is '" + (nextState ? "Alive" : "Dead" ) + "'");

  // update the cell in the nextGrid
  nextGrid[yCell][xCell] = nextState;
};

const showGrid = () => {
  // console.table(grid);

  const gridCanvas = document.getElementById("gridCanvas");
  gridCanvas.style.background = "#fff";
  const winH = window.innerHeight;
  const winW = window.innerWidth;
  gridCanvas.height = winH - 240; // allow room for headings below canvas
  gridCanvas.width = winW - 640; // remove scroll bar
  const CellSize = Math.floor((winH + winW) / 3 / grid_x_size);
  const ctx = gridCanvas.getContext("2d");
  for (let y = 0; y < grid_y_size; y++) {
    for (let x = 0; x < grid_x_size; x++) {
      let yStart = y * CellSize;
      let xStart = x * CellSize;
      if (grid[y][x]) {
        ctx.fillStyle = "#123";
      } else {
        ctx.fillStyle = "#def";
      }
      ctx.fillRect(xStart + 1, yStart + 1, CellSize - 2, CellSize - 2);
    }
  }
};

const tick = () => {
  // console.log("tick!");

  showGrid();
  nextGrid = make2DArray();
  for (let y = 0; y < grid_y_size; y++) {
    for (let x = 0; x < grid_x_size; x++) {
      checkNeighborhood(y, x);
    }
  }
  grid = nextGrid;
  nextGrid = null;
};

const countPop = () => {
  let count = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 1) {
        count++;
      }
    }
  }

  return count;
};

// main loop
initGrid();
document.getElementById("name").innerHTML = data?.name;
document.getElementById("type").innerHTML = data?.type;
const genDiv = document.getElementById("generation");
const popDiv = document.getElementById("population");
for (let i = 0; i < generations; i++) {
  setTimeout(() => {
    tick();
    genDiv.innerHTML = i + 1;
    popDiv.innerHTML = countPop();
  }, i * delay);
}
showGrid();
