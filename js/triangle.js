const canvas = document.querySelector("#glcanvas");
const ctx = canvas.getContext("2d");

function drawRect() {
    ctx.fillRect(0, 0, 400, 275);
    ctx.clearRect(10, 10, 380, 255);
}

// function draw() {
//     const canvas = document.getElementById("glcanvas");
//     if (canvas.getContext) {
//       const ctx = canvas.getContext("2d");
  
//       ctx.fillRect(25, 25, 100, 100);
//       ctx.clearRect(45, 45, 60, 60);
//       ctx.strokeRect(50, 50, 50, 50);
//     }
//   }

function drawTri() {
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(70, 50);
    ctx.lineTo(70, 70);
    ctx.fill();
}

drawRect();
drawTri();