const toolsCont = document.querySelector(".tools-cont");
const optionsCont = document.querySelector(".options-cont");
const pencilTool = document.querySelector(".pencil-tool");
const eraserTool = document.querySelector(".eraser-tool-cont");
const pen = document.querySelector(".pen");
const eraser = document.querySelector(".eraser");
const notes = document.querySelector(".notes");
const upload = document.querySelector(".upload");
let pencilFlag = false;
let eraserFlag = false;

let isOptionsOpen = true;

optionsCont.addEventListener("click", function () {
  if (isOptionsOpen) {
    closeTools();
  } else {
    openTools();
  }
  isOptionsOpen = !isOptionsOpen;
});

function openTools() {
  const img = optionsCont.children[0];
  img.src = "icons/close.svg";
  toolsCont.style.display = "flex";
}

function closeTools() {
  const img = optionsCont.children[0];
  img.src = "icons/hamburger.png";
  toolsCont.style.display = "none";
  pencilTool.style.display = "none";
  eraserTool.style.display = "none";
}

pen.addEventListener("click", function () {
  pencilFlag = !pencilFlag;
  pencilTool.classList.toggle("hide");
});

eraser.addEventListener("click", function () {
  eraserFlag = !eraserFlag;
  eraserTool.classList.toggle("hide");
});

upload.addEventListener("click", (e) => {
  // Open file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="remove"></div>
            <div class="minimize"></div>
        </div>
        <div class="note-cont">
            <img src="${url}"/>
        </div>
        `;
    createSticky(stickyTemplateHTML);
  });
});

notes.addEventListener("click", function (e) {
  let stickyTemplateHTML = `
    <div class="header-cont">
        <div class="remove"></div>
        <div class="minimize"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>
    `;
  createSticky(stickyTemplateHTML);
});

function createSticky(stickyTemplateHTML) {
  let stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "sticky-cont");
  stickyCont.innerHTML = stickyTemplateHTML;
  document.body.appendChild(stickyCont);

  let minimize = stickyCont.querySelector(".minimize");
  let remove = stickyCont.querySelector(".remove");
  notesActions(minimize, remove, stickyCont);

  stickyCont.onmousedown = function (event) {
    addDragAndDrop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
    return false;
  };
}

function notesActions(minimize, remove, stickyCont) {
  remove.addEventListener("click", (e) => {
    stickyCont.remove();
  });
  minimize.addEventListener("click", (e) => {
    const noteCont = stickyCont.querySelector(".note-cont");
    const display = getComputedStyle(noteCont).getPropertyValue("display");
    if (display === "block") {
      noteCont.style.display = "none";
    } else {
      noteCont.style.display = "block";
    }
  });
}

function addDragAndDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener("mousemove", onMouseMove);

  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}
