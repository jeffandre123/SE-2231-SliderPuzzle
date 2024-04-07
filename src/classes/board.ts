class Board {
    private tiles: number[][];
  
    // create a board from an n-by-n array of tiles,
    // where tiles[row][col] = tile at (row, col)
    constructor(tiles: number[][]) {
      this.tiles = tiles;
    }
  
    // string representation of this board
    toString(): string {
      let result = `${this.dimension()}\n`;
      for (let row = 0; row < this.dimension(); row++) {
        for (let col = 0; col < this.dimension(); col++) {
          result += `${this.tiles[row][col]} `;
        }
        result += '\n';
      }
      return result;
    }
  
    // board dimension n
    dimension(): number {
      return this.tiles.length;
    }
  
    // number of tiles out of place
    hamming(): number {
      let distance = 0;
      for (let row = 0; row < this.dimension(); row++) {
        for (let col = 0; col < this.dimension(); col++) {
          if (this.tiles[row][col] !== row * this.dimension() + col + 1 && this.tiles[row][col] !== 0) {
            distance++;
          }
        }
      }
      return distance;
    }
  
    // sum of Manhattan distances between tiles and goal
    manhattan(): number {
      let distance = 0;
      for (let row = 0; row < this.dimension(); row++) {
        for (let col = 0; col < this.dimension(); col++) {
          if (this.tiles[row][col] !== 0) {
            const goalRow = Math.floor((this.tiles[row][col] - 1) / this.dimension());
            const goalCol = (this.tiles[row][col] - 1) % this.dimension();
            distance += Math.abs(row - goalRow) + Math.abs(col - goalCol);
          }
        }
      }
      return distance;
    }
  
    // is this board the goal board?
    isGoal(): boolean {
      for (let row = 0; row < this.dimension(); row++) {
        for (let col = 0; col < this.dimension(); col++) {
          if (this.tiles[row][col] !== row * this.dimension() + col + 1 && (row !== this.dimension() - 1 || col !== this.dimension() - 1)) {
            return false;
          }
        }
      }
      return true;
    }
  
    // does this board equal y?
    equals(y: Board): boolean {
      if (this.dimension() !== y.dimension()) {
        return false;
      }
      for (let row = 0; row < this.dimension(); row++) {
        for (let col = 0; col < this.dimension(); col++) {
          if (this.tiles[row][col] !== y.tiles[row][col]) {
            return false;
          }
        }
      }
      return true;
    }
  
    // all neighboring boards
    neighbors(): Board[] {
      const neighbors: Board[] = [];
      let blankRow = -1;
      let blankCol = -1;
      for (let row = 0; row < this.dimension(); row++) {
        for (let col = 0; col < this.dimension(); col++) {
          if (this.tiles[row][col] === 0) {
            blankRow = row;
            blankCol = col;
            break;
          }
        }
      }
      if (blankRow > 0) {
        const neighbor = this.swap(blankRow, blankCol, blankRow - 1, blankCol);
        neighbors.push(neighbor);
      }
      if (blankRow < this.dimension() - 1) {
        const neighbor = this.swap(blankRow, blankCol, blankRow + 1, blankCol);
        neighbors.push(neighbor);
      }
      if (blankCol > 0) {
        const neighbor = this.swap(blankRow, blankCol, blankRow, blankCol - 1);
        neighbors.push(neighbor);
      }
      if (blankCol < this.dimension() - 1) {
        const neighbor = this.swap(blankRow, blankCol, blankRow, blankCol + 1);
        neighbors.push(neighbor);
      }
      return neighbors;
    }
  
    // a board that is obtained by exchanging any pair of tiles
    twin(): Board {
      let firstRow = -1;
      let firstCol = -1;
      let secondRow = -1;
      let secondCol = -1;
      for (let row = 0; row < this.dimension(); row++) {
        for (let col = 0; col < this.dimension(); col++) {
          if (this.tiles[row][col] !== 0 && firstRow === -1) {
            firstRow = row;
            firstCol = col;
          } else if (this.tiles[row][col] !== 0 && firstRow !== -1) {
            secondRow = row;
            secondCol = col;
            break;
          }
        }
      }
      return this.swap(firstRow, firstCol, secondRow, secondCol);
    }
  
    private swap(row1: number, col1: number, row2: number, col2: number): Board {
      const tiles = this.tiles.map((row) => row.slice());
      [tiles[row1][col1], tiles[row2][col2]] = [tiles[row2][col2], tiles[row1][col1]];
      return new Board(tiles);
    }
  }
  
  export default Board;