import Board from './board'
import { MinHeap } from 'min-heap-typed'

class SearchNode {
  board: Board
  moves: number
  previous: SearchNode | null
  priority: number

  constructor (board: Board, moves: number, previous: SearchNode | null) {
    this.board = board
    this.moves = moves
    this.previous = previous
    this.priority = this.board.manhattan() + this.moves
  }
}

class Solver {
  private initialSearchNode: SearchNode
  private goalSearchNode: SearchNode | null = null
  private solvable: boolean

  // find a solution to the initial board (using the A* algorithm)
  constructor (initial: Board) {
    if (initial === null) {
      throw new Error('Initial board cannot be null')
    }

    this.initialSearchNode = new SearchNode(initial, 0, null)
    this.solvable = this.solve()
  }

  // is the initial board solvable? (see below)
  isSolvable (): boolean {
    return this.solvable
  }

  // min number of moves to solve initial board; -1 if unsolvable
  moves (): number {
    return this.solvable ? this.goalSearchNode!.moves : -1
  }

  // sequence of boards in a shortest solution; null if unsolvable
  solution (): Board[] {
    if (!this.solvable) {
      return []
    }

    const solution: Board[] = []
    let current: SearchNode | null = this.goalSearchNode
    while (current !== null) {
      solution.unshift(current.board)
      current = current.previous
    }
    return solution
  }

  private solve (): boolean {
    const pq = new MinHeap<SearchNode>()
    pq.add(this.initialSearchNode)

    const twinPq = new MinHeap<SearchNode>()
    const twinInitial = this.initialSearchNode.board.twin()
    twinPq.add(new SearchNode(twinInitial, 0, null))

    while (!pq.isEmpty() && !twinPq.isEmpty()) {
      const node = pq.poll()
      if (node && node.board.isGoal()) {
        this.goalSearchNode = node
        return true
      }

      if (node) {
        for (const neighbor of node.board.neighbors()) {
          if (node.previous === null || !neighbor.equals(node.previous.board)) {
            pq.add(new SearchNode(neighbor, node.moves + 1, node))
          }
        }
      }

      const twinNode = twinPq.poll()
      if (twinNode && twinNode.board.isGoal()) {
        return false
      }

      if (twinNode) {
        for (const neighbor of twinNode.board.neighbors()) {
          if (
            twinNode.previous === null ||
            !neighbor.equals(twinNode.previous.board)
          ) {
            twinPq.add(new SearchNode(neighbor, twinNode.moves + 1, twinNode))
          }
        }
      }
    }

    return false
  }
}

export default Solver
