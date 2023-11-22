class MazeCell {
    x; y;
    walls;
    visited;
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
        this.walls = [true, true, true, true];  // Walls of cell: top, right, bottom, left
        this.visited = false;
    }
    reset() {
        this.visited = false;
        this.walls.fill(true);
    }
}

class MazeGenerator {
    cells;          // Array of MazeCell
    width;          // Number of horizontal cells
    height;         // Number of vertical cells
    curCell;        // Current cell
    stack;          // Stack to hold cells during generation
    cellSize;       // Size of cell in pixels
    rndSeed;        // Random seed
    reseted;        // Are cells reseted and ready for ney generation
    constructor(seed) {
        if(typeof seed == 'number')
            this.rndSeed = seed;
        else
            this.rndSeed = Date.now();
        this.stack = [];
        this.cellSize = 5;
        this.reseted = true;
    }
    init(_w, _h) {
        this.width = _w;
        this.height = _h;
        this.cells = null;
        this.initCells();
    }
    /* Create array of cells */
    initCells() {
        this.cells = [];
        for(let y=0;y<this.height;y++) {
            this.cells.push([]);
            for(let x=0;x<this.width;x++) {
                this.cells[y].push(new MazeCell(x, y));
            }
        }
    }
    /* Returns array of 4 neighbors of cell (x,y) */
    getNeighbors(x, y) {
        return [
            this.getCell(x, y - 1),     // top
            this.getCell(x + 1, y),     // right
            this.getCell(x, y + 1),     // bottom
            this.getCell(x - 1, y),     // left
        ];
    }
    /* Returns cell by coordinates */
    getCell(x, y) {
        if(x < 0 || x >= this.width || y < 0 || y >= this.height)
            return null;
        return this.cells[y][x];
    }
    /* Remove walls between cells a and b */
    removeWall(a, b) {
        let x = a.x - b.x;
        if (x === 1) {
            a.walls[3] = false;
            b.walls[1] = false;
        } else if (x === -1) {
            a.walls[1] = false;
            b.walls[3] = false;
        }
        let y = a.y - b.y;
        if (y === 1) {
            a.walls[0] = false;
            b.walls[2] = false;
        } else if (y === -1) {
            a.walls[2] = false;
            b.walls[0] = false;
        }
    }
    /* Reset cells to initial state before new generation */
    reset() {
        for(let y=0;y<this.height;y++) {
            for(let x=0;x<this.width;x++) {
                let cell = this.getCell(x, y);
                if(cell) {
                    cell.reset();
                }
            }
        }
        this.reseted = true;
    }
    /* Depth-first search maze generation algorithm
    From Wikipedia:
        1. Choose the initial cell, mark it as visited and push it to the stack
        2. While the stack is not empty
            1. Pop a cell from the stack and make it a current cell
            2. If the current cell has any neighbours which have not been visited
                1. Push the current cell to the stack
                2. Choose one of the unvisited neighbours
                3. Remove the wall between the current cell and the chosen cell
                4. Mark the chosen cell as visited and push it to the stack
    */
    generate() {
        if(!this.reseted)
            this.reset();
        this.curCell = this.getCell(0, 0);
        this.curCell.visited = true;
        this.stack.push(this.curCell);
        while(this.stack.length > 0) {
            this.curCell = this.stack.pop();
            let neighbors = this.getNeighbors(this.curCell.x, this.curCell.y);
            let unvisitedNeighbors = [];
            for(let i=0;i < neighbors.length;i++) {
                if(neighbors[i] && !neighbors[i].visited)
                    unvisitedNeighbors.push(neighbors[i]);
            }
            if(unvisitedNeighbors.length > 0) {
                this.stack.push(this.curCell);
                let neighbor = this.rndElement(unvisitedNeighbors);
                this.removeWall(this.curCell, neighbor);
                neighbor.visited = true;
                this.stack.push(neighbor);
            }
        }
        this.reseted = false;
    }
    /* Own random functions because standard JS Math random don't support seeding */
    rnd() {
        this.rndSeed = (this.rndSeed * 9301 + 49297) % 233280;
        return this.rndSeed / 233280.0;
    }
    /* Returns random number in range min to max*/
    rndArbitrary(min, max) {
        return min + this.rnd() * (max - min);
    }
    /* Returns random array element */
    rndElement(arr) {
        if(!arr || arr.length == 0)
          return null;
        return arr[Math.round(this.rndArbitrary(0, arr.length - 1))];
    }
}