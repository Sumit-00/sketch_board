let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tool = canvas.getContext("2d");
let isMouseDown = false;

const pencilsColor = document.querySelectorAll(".pencil-color");
const pencilWidthEle = document.querySelector(".pencil-width");
const eraserWidthEle = document.querySelector(".eraser-width");
const download = document.querySelector(".download");
const undo = document.querySelector(".undo");
const redo = document.querySelector(".redo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthEle.value;
let eraserWidth = eraserWidthEle.value;

let undoRedoTracker = [];
let track = 0;

tool.strokeStyle = penColor;

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  const data = {
    x: e.clientX,
    y: e.clientY,
  };
  // beginPath(data);
  socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) {
    const data = {
      x: e.clientX,
      y: e.clientY,
    };
    socket.emit("drawStroke", data);
    // drawStroke(data);
  }
});

canvas.addEventListener("mouseup", (e) => {
  isMouseDown = false;

  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
});

function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

pencilsColor.forEach((ele) => {
  ele.addEventListener("click", () => {
    const color = ele.classList[0];
    penColor = color;
    tool.strokeStyle = penColor;
  });
});

pencilWidthEle.addEventListener("change", () => {
  penWidth = pencilWidthEle.value;
  console.log(penWidth);
  tool.lineWidth = penWidth;
});

eraserWidthEle.addEventListener("change", () => {
  eraserWidth = eraserWidthEle.value;
  tool.lineWidth = eraserWidth;
});

eraser.addEventListener("click", () => {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidth;
  }
});

download.addEventListener("click", () => {
  const url = canvas.toDataURL();

  let a = document.createElement("a");
  a.href = url;
  a.download = "board.png";
  a.click();
});

undo.addEventListener("click", (e) => {
  if (track > 0) track--;
  // track action
  let data = {
    trackValue: track,
    undoRedoTracker,
  };
  socket.emit("redoUndo", data);
});
redo.addEventListener("click", (e) => {
  if (track < undoRedoTracker.length - 1) track++;
  // track action
  let data = {
    trackValue: track,
    undoRedoTracker,
  };
  socket.emit("redoUndo", data);
});

function undoRedoCanvas(trackObj) {
  track = trackObj.trackValue;
  undoRedoTracker = trackObj.undoRedoTracker;

  let url = undoRedoTracker[track];
  let img = new Image(); // new image reference element
  img.src = url;
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

socket.on("beginPath", (data) => {
  // data -> data from server
  beginPath(data);
});

socket.on("drawStroke", (data) => {
  drawStroke(data);
});

socket.on("redoUndo", (data) => {
  console.log(data);
  undoRedoCanvas(data);
});
