// init all the cell coords
const cells = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [0, 9],
  [1, 0],
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [1, 7],
  [1, 8],
  [1, 9],
  [2, 0],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [2, 7],
  [2, 8],
  [2, 9],
  [3, 0],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [3, 7],
  [3, 8],
  [3, 9],
  [4, 0],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 4],
  [4, 5],
  [4, 6],
  [4, 7],
  [4, 8],
  [4, 9],
  [5, 0],
  [5, 1],
  [5, 2],
  [5, 3],
  [5, 4],
  [5, 5],
  [5, 6],
  [5, 7],
  [5, 8],
  [5, 9],
  [6, 0],
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],
  [6, 6],
  [6, 7],
  [6, 8],
  [6, 9],
  [7, 0],
  [7, 1],
  [7, 2],
  [7, 3],
  [7, 4],
  [7, 5],
  [7, 6],
  [7, 7],
  [7, 8],
  [7, 9],
  [8, 0],
  [8, 1],
  [8, 2],
  [8, 3],
  [8, 4],
  [8, 5],
  [8, 6],
  [8, 7],
  [8, 8],
  [8, 9],
  [9, 0],
  [9, 1],
  [9, 2],
  [9, 3],
  [9, 4],
  [9, 5],
  [9, 6],
  [9, 7],
  [9, 8],
  [9, 9],
];

let currGrid = {};
let nextGrid = {};

const setCell = (coord, state, grid) => {
  grid["x" + coord[0] + "y" + coord[1]] = { coord: coord, alive: state };
};

const getCell = (coord) => {
  return currGrid["x" + coord[0] + "y" + coord[1]] || null;
};

const initGrid = () => {
  // Seed a few cells as "alive"
  const seedCells = [12, 22, 32];
  // Init all cells in the grid
  cells.forEach((cell, index) => {
    let seedState = seedCells.includes(index) ? 1 : 0;
    setCell(cell, seedState, currGrid);
  });
};

/**
 * sum all the alive cells in the 9 cell neighborhood of the (passed) center cell
 * (including the center cell's state). If the sum of alive cells is:
 *    3: the cell will become or stay alive
 *    4: the cell state will be unchanged
 *    all other sums: the cell will die
 */
const checkNeighborhood = (cell) => {
  let c = getCell(cell);

  const x = c.coord[0];
  const y = c.coord[1];
  // console.log("Checking Neighbors for cell [" + x + ", " + y + "]");

  // init neighborhood alive sum with the inner cell's state
  let sum = c.alive ? 1 : 0;

  // get all 8 neighbor cells and add any alive cells to the sum
  const xOffsets = [-1, 0, 1, -1, 1, -1, 0, 1];
  const yOffsets = [-1, -1, -1, 0, 0, 1, 1, 1];
  for (let i = 0; i < 8; i++) {
    let xKey = x + xOffsets[i];
    let yKey = y + yOffsets[i];
    let keyCoord = [xKey, yKey];
    let n = getCell(keyCoord);
    if (n?.alive) {
      sum += n.alive;
    }
  }

  // the cell will stay or become dead by default
  let nextState = 0;
  if (sum === 3) {
    nextState = 1;
  } else if (sum === 4) {
    nextState = c.alive ? 1 : 0;
  }
  // update the cell in the nextGrid
  // console.log("Next state is '" + nextState + "'");
  setCell(cell, nextState, nextGrid);
};

const showGrid = (grid) => {
  console.table(grid);
};

const tick = () => {
  console.log("tick!");
  cells.forEach((cell) => {
    checkNeighborhood(cell);
  });
  currGrid = { ...nextGrid };
  nextGrid = {};
};

// main loop
initGrid();
showGrid(currGrid);
for (let i = 0; i < 4; i++) {
  tick();
  showGrid(currGrid);
}
