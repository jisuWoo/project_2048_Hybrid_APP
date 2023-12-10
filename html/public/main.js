const gameBoard = document.getElementById("game-board")
const GRID_SIZE = 4
const CELL_SIZE = 15
const CELL_GAP = 2


let selectedPlayer = localStorage.getItem('selectedPlayer');
console.log(selectedPlayer);

class Player {
  score = 0

  constructor() {
    this.score = 0;
  }
}

const Player1 = new Player();
const Player2 = new Player();
let currentPlayer = Player1;

class Cell {
  #cellElement //# = 클래스에서 Private 속성을 만들기 위해 쓰는것 
  //셀속성 
  #x
  #y
  //셀좌표
  #tile
  //타일 
  #mergeTile
  //합칠타일

  //생성자
  constructor(cellElement, x, y) {
    this.#cellElement = cellElement
    this.#x = x
    this.#y = y
  }

  //x값 가져옴
  get x() {
    return this.#x
  }
  //y값 가져옴
  get y() {
    return this.#y
  }
  //타일 가져옴
  get tile() {
    return this.#tile
  }

  //타일 세팅 여기서 타일을 셀위치로 맞춤
  set tile(value) {
    this.#tile = value
    if (value == null) return
    this.#tile.x = this.#x
    this.#tile.y = this.#y
  }

  //머지타일 가져옴
  get mergeTile() {
    return this.#mergeTile
  }

  //머지타일 세팅 여기서 머지타일을 셀위치로 맞춤
  set mergeTile(value) {
    this.#mergeTile = value
    if (value == null) return
    this.#mergeTile.x = this.#x
    this.#mergeTile.y = this.#y
  }


  //해당 타일이 비워줘 있는지,즉 배치가능한 타일인지에 대한 불값을 보내줌
  canAccept(tile) {
    return (
      //아예 타일없거나
      this.tile == null ||
      //합칠타일이 없거나 타일의 값이 같을때 true를 보냄
      (this.mergeTile == null && this.tile.value === tile.value)
    )
  }

  //
  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return
    
    if ((this.tile.status == "Player1" && this.mergeTile.status == "Player2") || (this.tile.status == "Player2" && this.mergeTile.status == "Player1")){
      // 플레이어 간의 부딫침 처리
      if(currentPlayer == Player1){
        this.tile.status = "Player1"
        Player1.score += this.tile.value + this.mergeTile.value
      }else{
        this.tile.status = "Player2"
        Player2.score += this.tile.value + this.mergeTile.value
      }
    }

    if (this.tile.status == "normal" && (this.mergeTile.status === "Player1")) {
      this.tile.status = this.mergeTile.status;
      Player1.score += this.tile.value + this.mergeTile.value
    }
    if (this.tile.status == "normal" && (this.mergeTile.status === "Player2")) {
      this.tile.status = this.mergeTile.status;
      Player2.score += this.tile.value + this.mergeTile.value
    }

    if (this.tile.status == "Player1" && (this.mergeTile.status === "normal")) {
      Player1.score += this.tile.value + this.mergeTile.value
    }
    if (this.tile.status == "Player2" && (this.mergeTile.status === "normal")) {
      Player2.score += this.tile.value + this.mergeTile.values
    }

    this.tile.value = this.tile.value + this.mergeTile.value
    this.mergeTile.remove()
    this.mergeTile = null
  }
}

function createCellElements(gridElement) {
  const cells = []
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cells.push(cell)
    gridElement.append(cell)
  }
  return cells
}

class Grid {
  #cells

  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE)
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      )
    })
  }

  get cells() {
    return this.#cells
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || []
      cellGrid[cell.y][cell.x] = cell
      return cellGrid
    }, [])
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || []
      cellGrid[cell.x][cell.y] = cell
      return cellGrid
    }, [])
  }

  get #emptyCells() {
    return this.#cells.filter(cell => cell.tile == null)
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
    return this.#emptyCells[randomIndex]
  }
}

class Tile {
  #tileElement
  #x
  #y
  #value
  #color
  #status

  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    tileContainer.append(this.#tileElement);
    this.value = value;
    this.color = "white"; // Set the initial color to yellow
    this.#status = "normal"; // 새로운 속성 추가
    this.updateColor();
  }

  get status() {
    return this.#status;
  }
  set status(value) {
    this.#status = value;
    this.updateColor(); // 상태가 변경되면 바로 색상 업데이트
  }
  
  get color() {
    return this.#color;
  }
  
  set color(value) {
    this.#color = value;
    this.#tileElement.style.backgroundColor = value; // 변경된 부분
    // 배경색이 잘 보이도록 노란색에 맞게 밝기 조절
    this.#tileElement.style.setProperty("--background-lightness", "80%");
    this.#tileElement.style.setProperty("--text-lightness", "20%");
  }

  updateColor() {
    // 상태에 따라서 다른 색상 지정
    switch (this.#status) {
      case "normal":
        this.color = "white";
        break;
      case "Player1":
        this.color = "yellow";
        break;
      case "Player2":
          this.color = "blue";
          break;
      // 다른 상태에 대한 처리 추가
    }
  }
  get value() {
    return this.#value
  }

  set value(v) {
    this.#value = v
    this.#tileElement.textContent = v
    const power = Math.log2(v)
    const backgroundLightness = 100 - power * 9
    this.#tileElement.style.setProperty(
      "--background-lightness",
      `${backgroundLightness}%`
    )
    this.#tileElement.style.setProperty(
      "--text-lightness",
      `${backgroundLightness <= 50 ? 90 : 10}%`
    )
  }

  set x(value) {
    this.#x = value
    this.#tileElement.style.setProperty("--x", value)
  }

  set y(value) {
    this.#y = value
    this.#tileElement.style.setProperty("--y", value)
  }

  remove() {
    this.#tileElement.remove()
  }

  waitForTransition(animation = false) {
    return new Promise(resolve => {
      this.#tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        {
          once: true,
        }
      )
    })
  }
}


async function handleInput(e) {
switch (e.key) {
  case "ArrowUp":
    if (!canMoveUp()) {
      setupInput()
      return
    }
    await moveUp()
    break
  case "ArrowDown":
    if (!canMoveDown()) {
      setupInput()
      return
    }
    await moveDown()
    break
  case "ArrowLeft":
    if (!canMoveLeft()) {
      setupInput()
      return
    }
    await moveLeft()
    break
  case "ArrowRight":
    if (!canMoveRight()) {
      setupInput()
      return
    }
    await moveRight()
    break
  default:
    setupInput()
    return
}

grid.cells.forEach(cell => cell.mergeTiles());

  const newTile = new Tile(gameBoard);
  newTile.status = "normal";
  grid.randomEmptyCell().tile = newTile;
  
  newTile.waitForTransition(true).then(() => {
    currentPlayer = currentPlayer === Player1 ? Player2 : Player1;
    updateTurnIndicator();
  });
  

  const player2Tiles = grid.cells.flat().filter(cell => cell.tile?.status === "Player2");
    if (player2Tiles.length === 0) {
    newTile.waitForTransition(true).then(() => {
      if(selectedPlayer == "Player1"){
        alert("Player win!"); 
      }else{
        alert("Player lose!");
      }
      StatusValue = 2;
      statusloop();
      gameover(selectedPlayer)
    });
  }

  const player1Tiles = grid.cells.flat().filter(cell => cell.tile?.status === "Player1");
    if (player1Tiles.length === 0) {
    newTile.waitForTransition(true).then(() => {
      if(selectedPlayer == "Player1"){
        alert("Player lose!"); 
      }else{
        alert("Player win!");
      }
      StatusValue = 2;
      statusloop();
      gameover(selectedPlayer)
    });
  }

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert("You lose");
    });
    return;
  }

  setupInput();
}

async function gameover(selectedPlayer) {
  let score;
  if (selectedPlayer == "Player1") {
      score = Player1.score;
  } else {
      score = Player2.score;
  }
  // 서버에 점수를 전송
  try {
      const response = await fetch('/api/addScore', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              username: "test",  // 실제 유저 이름 또는 식별자로 변경
              score: score,
          }),
      });

      const data = await response.json();

      if (data.success) {
          console.log('Score added to the ranking');
      } else {
          console.error('Error adding score to the ranking');
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

function updateTurnIndicator() {
  const turnIndicator = document.getElementById('turn-indicator');
  const scoreIndicator = document.getElementById('score-indicator');
  turnIndicator.textContent = currentPlayer === Player1 ? 'Player 1' : 'Player 2';
  
  if(selectedPlayer == 'Player1'){
    console.log("p1 " + Player1.score);
    scoreIndicator.textContent = Player1.score;
  }else if(selectedPlayer == 'Player2'){
    console.log("p2 " + Player2.score);
    scoreIndicator.textContent = Player2.score;
  }
}

const grid = new Grid(gameBoard);
const Player1tile = new Tile(gameBoard);
const Player2tile = new Tile(gameBoard);
Player1tile.status = "Player1";
grid.randomEmptyCell().tile = Player1tile;
Player2tile.status = "Player2";
grid.randomEmptyCell().tile = Player2tile;
setupInput()

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true })
}
  
function moveUp() {
  return slideTiles(grid.cellsByColumn)
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
  return slideTiles(grid.cellsByRow)
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap(group => {
      const promises = []
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j]
          if (!moveToCell.canAccept(cell.tile)) break
          lastValidCell = moveToCell
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition())
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile
          } else {
            lastValidCell.tile = cell.tile
          }
          cell.tile = null
        }
      }
      return promises
    })
  )
}

function canMoveUp() {
  return canMove(grid.cellsByColumn)
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

function canMoveLeft() {
  return canMove(grid.cellsByRow)
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false
      if (cell.tile == null) return false
      const moveToCell = group[index - 1]
      return moveToCell.canAccept(cell.tile)
    })
  })
}

function restartGame() {
  // 초기 상태로 변수 및 객체를 설정
  Player1.score = 0;
  Player2.score = 0;
  currentPlayer = Player1;

  // 기존 타일 및 셀 제거
  grid.cells.forEach(cell => {
    if (cell.tile != null) {
      cell.tile.remove();
      cell.tile = null;
    }
    if (cell.mergeTile != null) {
      cell.mergeTile.remove();
      cell.mergeTile = null;
    }
  });

  // 플레이어 1, 2의 초기 타일 배치
  const Player1tile = new Tile(gameBoard);
  Player1tile.status = "Player1";
  grid.randomEmptyCell().tile = Player1tile;

  const Player2tile = new Tile(gameBoard);
  Player2tile.status = "Player2";
  grid.randomEmptyCell().tile = Player2tile;

  // 입력 이벤트 설정
  setupInput();

  // 턴 표시 업데이트
  updateTurnIndicator();
}