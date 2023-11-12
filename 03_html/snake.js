const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');
const canvasRect = canvas.getBoundingClientRect();
const playerPool = [];
const maxPlayerPoolSize = 20;
const obstacles = [];
const obstacleSize = 20;
const rotationSpeed = 1;
const RestartBtn = document.getElementById('Restart');

const obstacleImage = new Image();
obstacleImage.src = 'test.png'; 

const collisionSound = document.getElementById('Sound');

let start = new Date();
var isMouseDown = false;
var mouseX = 0;
var mouseY = 0;
var player = [];
var playerSize = 20;
var score = 0;

var gamePaused = true; 


class Food {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

var food = new Food(
    Math.floor(Math.random() * canvas.width),
    Math.floor(Math.random() * canvas.height),
    10,
    '#81c147'
);

class PlayerBodyObject {
    constructor(prevX, prevY) {
        this.PlayerPosX = prevX;
        this.PlayerPosY = prevY;
        this.dirX = 0;
        this.dirY = 0;
        this.speed = 5;
        this.size = playerSize;
        this.color = '#0000FF';
        this.angle = Math.random() * Math.PI * 2;
        this.prevX = prevX;
        this.prevY = prevY;
    }

    UpdatePosition(prevX, prevY) {
        this.dirX = prevX - this.PlayerPosX;
        this.dirY = prevY - this.PlayerPosY;

        let distance = Math.sqrt((this.dirX * this.dirX) + (this.dirY * this.dirY));

        this.dirX /= distance;
        this.dirY /= distance;

        if(isMouseDown == true){
          this.speed = 10;
        }else{
          this.speed = 5;
        }

        if (distance > 10) {
            this.prevX = this.PlayerPosX;
            this.prevY = this.PlayerPosY;

            this.PlayerPosX += this.dirX * this.speed;
            this.PlayerPosY += this.dirY * this.speed;
        }
        this.drawBody(this.PlayerPosX, this.PlayerPosY);
    }
    drawBody(X, Y) {
        ctx.beginPath();
        ctx.arc(X, Y, playerSize, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function playCollisionSound() {
  collisionSound.currentTime = 0; // 효과음을 매번 처음부터 재생하기 위해
  collisionSound.play();
}

player.push(new PlayerBodyObject(80, 100));  
player.push(new PlayerBodyObject(90, 100))
player.push(new PlayerBodyObject(100, 100)); // 초기에 플레이어 생성

function createObstacle() {
     const shape = Math.random() < 0.5 ? 'rectangle' : 'circle';
    const side = Math.floor(Math.random() * 8);
    let x, y, dx, dy, lifetime;
    lifetime = 0;
    switch (side) {
      case 0: // top-left
        x = Math.random() * canvas.width;
        y = -obstacleSize;
        dx = Math.floor(Math.random() * 3) + 1;
        dy = Math.floor(Math.random() * 3) + 1;
        break;
      case 1: // top
        x = Math.random() * canvas.width;
        y = -obstacleSize;
        dx = Math.floor(Math.random() * 3) - 1;
        dy = Math.floor(Math.random() * 3) + 1;
        break;
      case 2: // top-right
        x = canvas.width + obstacleSize;
        y = Math.random() * canvas.height;
        dx = Math.floor(Math.random() * 3) - 1;
        dy = Math.floor(Math.random() * 3) + 1;
        break;
      case 3: // right
        x = canvas.width + obstacleSize;
        y = Math.random() * canvas.height;
        dx = Math.floor(Math.random() * 3) - 1;
        dy = Math.floor(Math.random() * 3) - 1;
        break;
      case 4: // bottom-right
        x = canvas.width + obstacleSize;
        y = canvas.height + obstacleSize;
        dx = Math.floor(Math.random() * 3) - 1;
        dy = Math.floor(Math.random() * 3) - 1;
        break;
      case 5: // bottom
        x = Math.random() * canvas.width;
        y = canvas.height + obstacleSize;
        dx = Math.floor(Math.random() * 3) + 1;
        dy = Math.floor(Math.random() * 3) - 1;
        break;
      case 6: // bottom-left
        x = -obstacleSize;
        y = canvas.height + obstacleSize;
        dx = Math.floor(Math.random() * 3) + 1;
        dy = Math.floor(Math.random() * 3) - 1;
        break;
      case 7: // left
        x = -obstacleSize;
        y = Math.random() * canvas.height;
        dx = Math.floor(Math.random() * 3) + 1;
        dy = Math.floor(Math.random() * 3) + 1;
        break;
    }

    obstacles.push({ x, y, dx, dy, lifetime, rotation: 0,shape });
  }

  function moveObstacles() {
    for (let obstacle of obstacles) {
      obstacle.x += obstacle.dx;
      obstacle.y += obstacle.dy;
      obstacle.rotation += (rotationSpeed * Math.PI / 180);
      obstacle.lifetime++;
  
      if (obstacle.lifetime > 30) {
        if (obstacle.x > canvas.width + obstacleSize || obstacle.x < -obstacleSize ||
          obstacle.y > canvas.height + obstacleSize || obstacle.y < -obstacleSize) {
          obstacles.splice(obstacles.indexOf(obstacle), 1);
          obstacle.lifetime = 0;
        }
      }
  
      // Check for collision with other obstacles
      for (let otherObstacle of obstacles) {
        if (obstacle !== otherObstacle) {
          if (
            obstacle.x <= otherObstacle.x + obstacleSize &&
            obstacle.x + obstacleSize >= otherObstacle.x &&
            obstacle.y <= otherObstacle.y + obstacleSize &&
            obstacle.y + obstacleSize >= otherObstacle.y
          ) {
            // Collision detected, change direction
            obstacle.dx *= -1;
            obstacle.dy *= -1;
            obstacle.rotation = Math.atan2(obstacle.dx, obstacle.dy);
          }
        }
      }
    }
  }
  
  function drawObstacles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let obstacle of obstacles) {
        ctx.save();
        ctx.translate(obstacle.x, obstacle.y);
        ctx.rotate(obstacle.rotation);
        ctx.fillStyle = 'red';

        if (obstacle.shape === 'rectangle') {
            // 사각형 그리기
            ctx.fillRect(-obstacleSize / 2, -obstacleSize / 2, obstacleSize, obstacleSize);
        } else if (obstacle.shape === 'circle') {
            // 원 그리기
            ctx.beginPath();
            ctx.arc(0, 0, obstacleSize / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
        //ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.size, obstacle.size);

        ctx.restore();
    }
  }
  

  function gameLoop() {
    let end = new Date();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gamePaused == true) {
      RestartBtn.style.display = 'hidden';
      if (Math.floor(Math.random() * 20) === 0) {
        createObstacle();
      }
  
      moveObstacles();
      drawObstacles();
  
      food.draw();
      foodColider();
      
      ctx.font = "20px serif";
      ctx.fillText("Score : "+ score, 20, 30);
      ctx.font = "20px serif";
      ctx.fillText("뱀길이 : " + player.length + " 시간 : " + Math.floor((end - start) / 1000), 120, 30);

      // 추가: player와 obstacles 간의 충돌 감지
      for (let i = 0; i < player.length; i++) {
        if (playerObstacleCollision(player[i])) {
          gamePaused = false; // 충돌 시 게임 오버 상태로 전환
          break; // 게임 오버 상태로 전환되면 더 이상의 검사는 필요하지 않음
        }
      }
    } else if(gamePaused == false) {
      RestartBtn.style.display = 'visible';
      ctx.fillStyle = 'red';
      ctx.font = '30px Arial';
      ctx.fillText('게임 오버', canvas.width / 2 - 80, canvas.height / 2);
    }
  }
  
  function playerObstacleCollision(currentPlayer) {
    for (let obstacle of obstacles) {
      const dx = obstacle.x - currentPlayer.PlayerPosX;
      const dy = obstacle.y - currentPlayer.PlayerPosY;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < playerSize + obstacleSize) {
        return true; // 충돌 감지
      }
    }
    return false; // 충돌 없음
  }
  

function foodColider() {
    if (player.length > 0 && gamePaused) {
        if (collision(food.x, food.y, food.size, player[0].PlayerPosX, player[0].PlayerPosY, playerSize)) {
            let prevX = player[player.length - 1].prevX;
            let prevY = player[player.length - 1].prevY;
          
            if (playerPool.length > 0) {
                // 기존 플레이어 객체 재사용
                const reusedPlayer = playerPool.pop();
                reusedPlayer.PlayerPosX = prevX;
                reusedPlayer.PlayerPosY = prevY;
                player.push(reusedPlayer);

            } else {
                // 새로운 플레이어 객체 생성
                player.push(new PlayerBodyObject(prevX, prevY));
            }
            score += 1;

            food = new Food(
                Math.floor(Math.random() * canvas.width),
                Math.floor(Math.random() * canvas.height),
                10,
                '#81c147'
            );
            playCollisionSound();

        }

        player[0].UpdatePosition(mouseX, mouseY);

        for (let i = 1; i < player.length; i++) {
            player[i].UpdatePosition(player[i - 1].prevX, player[i - 1].prevY);
        }
    }
}



function onMousemove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function collision(foodX, foodY, foodSize, playerX, playerY, playerSize) {
    const dx = foodX - playerX;
    const dy = foodY - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < foodSize + playerSize) {
        return true;
    } else {
        return false;
    }
}

document.addEventListener('mousedown', () => {
  isMouseDown = true;
});

// 마우스 업 이벤트 리스너 추가
document.addEventListener('mouseup', () => {
  isMouseDown = false;
});


setInterval(gameLoop, 1000 / 60);

document.addEventListener('mousemove', onMousemove);
RestartBtn.addEventListener('click',() => {

  if(gamePaused == false){
    location.reload();
    gamePaused = true;
  }

});
