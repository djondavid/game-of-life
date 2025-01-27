# Conway's "Game of Life" Coding Notes

It is a _zero player game_. Its evolution is determined by its initial state and requires no further input. The fun of the game is creating initial configurations and observing how they evolve. Some may evolve interesting patters. The game is _undecidable_, meaning that there is no way to predict if a later pattern is ever going to appear. Some patterns may evolve indefinitely, others may "die out", some may become "static". [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

**Rules**

- played on an infinite, 2 dimensional orthogonal grid (x, y)
- cells have 2 states; "alive" and "dead"
- all cells update at once from current state to the next state (such that each "generation" is a snapshot of the grid in time)
- how many "alive" neighbors (8) around each cell determines the next state of the (center) cell:
  - if there are less than 2 alive neighbors, the cell will die (from under population)
  - if there are 2 or 3 alive neighbors, the cell will stay alive (lives on to the next generation)
  - if there are more than 3 alive neighbors, the cell will die (from over population)
  - if a dead cell has exactly 3 alive neighbors, it will become alive (or born by reproduction)
- we must start the game with some initial configuration of "alive" cells
- frequently occurring patterns that may evolve include:
  1. Still lifes (do not change from one generation to the next)
  2. Oscillators (which return to their initial state after a finite number of generations)
  3. Spaceships (which translate themselves across the grid)
  4. Chatoic

## Reality

We cannot create or maintain an "infinite" grid (memory, processing time, etc.).

### Some suggested grid sizes:

- 10 x 10 (100 cells) very small
- 16 x 16 (256 cells)
- 25 x 25 (625 cells) small
- 32 x 32 (1,024 cells)
- 50 x 50 (2,500 cells) medium
- 64 x 64 (4,096 cells)
- 100 x 100 (10K cells) large
- 256 x 256 (65,536 cells)
- 500 x 500 (250K cells) very large
- 1000 x 1000 (1M cells)

### What to do if cells go past the edge of a finite grid?

- they become dead
- they wrap to the opposite edge(s)

### How do we store such a large number of cells such that we can evaluate them efficiently?

- A single array (complicated to find index from 2D coords)
- A 2D array (an array of arrays, not really fun in Javascript but allow indexing via coords)
- An object (fast indexing via keys of coords but heavy on memory)

### What properties do we want to store for each cell

- **Required -** the status of the cell (alive or dead) - Boolean, 0 or 1?
- the cell's coordinates (x, y) on the grid
- the index into the array? or use a key based upon the coordinates
- has this cell been evaluated already?

### How do evaluate next state while maintaining current state (so we don't overwrite current cell state until all cells have been evaluated)?

- maintain 2 grids; current and next
- maintain 2 states in each cell object; current and next

### How do we efficiently process each cell to determine its next state?

- only store "alive" cells, no need to store dead cells
- only evaluate alive cells and dead cells that have an alive neighbor
- simplify the evaluation of a cell by using an egocentric approach; get the sum of all alive cells in the 9 cell neighborhood (the 8 neighbors and the center cell we are processing)
  - if the sum is 3, the cell's next state will be alive
  - if the sum is 4, the cell's next state will be it's current state
  - all other sums, the cells' next state will be dead
- use a simple algorithm to get all the cells in the neighborhood:
  - the cells coordinates +1, +0, and -1 in both x and y axis: [(x+1, y+1), (x+0, y+1), (x-1, y+1), (x+1, y+0), (x+0, y+0), (x-1, y+0), (x+1, y-1), (x+0, y-1), (x-1, y-1)]
- keep track of any dead cells with alive neighbors so that we can evaluate them too
- keep track of which cells we have already evaluated so that we don't evaluate them more than once

### Future considerations

- UI? Graphics/Vector lib (Canvas?)
- How do we set the initial configuration? UI, code, JSON, random `grid[x][y] = floor(random(2));`
- Algorithm for "wrapping" the grid edges together?
- Memoization or Hashing algorithms
