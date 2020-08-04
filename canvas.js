let canvas = document.getElementById("myCanvas"),
  elemLeft = canvas.offsetLeft + canvas.clientLeft,
  elemTop = canvas.offsetTop + canvas.clientTop,
  ctx = canvas.getContext("2d"),
  elements = [],
  rectangle = document.querySelector("#rectangle"),
  circle = document.querySelector("#circle"),
  input = document.querySelector("#input"),
  output = document.querySelector("#output"),
  textarea = document.querySelector("#textarea"),
  isMoving = false,
  currentIndex = 0,
  createCircle = false,
  addNewCircle = false;
(onlyOne = true), (temp = {}), (onCanvas = false);
getDataFromStorage();
circle.onmousedown = function (e) {
  onCanvas = false;
  elements.push({
    type: "circle",
    X: e.clientX - canvas.offsetLeft + canvas.clientLeft,
    Y: e.clientY - canvas.offsetTop + canvas.clientTop,
    lineWidth: 0,
    strokeStyle: "blue",
  });
  currentIndex = elements.length - 1;
  isMoving = true;
  resetSelect();
};
circle.onmouseup = function (e) {
  elements.pop();
  isMoving = false;
  resetSelect();
};
rectangle.addEventListener("mousedown", (e) => {
  onCanvas = false;
  elements.push({
    type: "rectangle",
    X: e.clientX - canvas.offsetLeft + canvas.clientLeft,
    Y: e.clientY - canvas.offsetTop + canvas.clientTop,
    lineWidth: 0,
    strokeStyle: "green",
  });
  currentIndex = elements.length - 1;
  isMoving = true;
  resetSelect();
});
rectangle.addEventListener("onmouseup", (e) => {
  elements.pop();
  isMoving = false;
  resetSelect();
});

canvas.addEventListener(
  "mousedown",
  function (event) {
    var x = event.pageX - elemLeft,
      y = event.pageY - elemTop;
    // let reversed = elements.reverse()
    elements.forEach(function (element) {
      if (
        y > element.Y - 40 &&
        y < element.Y + 40 &&
        x > element.X - 40 &&
        x < element.X + 40
      ) {
        if (onlyOne) {
          resetSelect();
          isMoving = true;
          temp[0] = element;
          elements.splice(elements.indexOf(element), 1);
          elements[elements.length] = temp[0];
          currentIndex = elements.length - 1;
          onlyOne = false;
        }
      } else {
        resetSelect();
      }
    });
  },
  false
);
canvas.addEventListener("mousemove", (e) => {
  if (isMoving) {
    onCanvas = true;
    fillTheGround(e);
  }
});
canvas.addEventListener("mouseup", (e) => {
  isMoving = false;
  resetSelect();
  onlyOne = true;
  savePos();
});

output.addEventListener('click', e => {
    textarea.value = ExportData()
})

input.addEventListener('click', e => {
    ImportData()
    fillTheGround()
})


function fillTheGround(e = event) {
    console.log('a');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  elements.forEach((element) => {
    if (element.type === "circle") {
      ctx.beginPath();
      ctx.arc(element.X, element.Y, 40, 0, Math.PI * 2);
      ctx.fillStyle = "blue";
      ctx.lineWidth = 5;
      ctx.strokeStyle = element.strokeStyle;
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.rect(element.X - 40, element.Y - 40, 80, 80);
      ctx.fillStyle = "green";
      ctx.lineWidth = 5;
      ctx.strokeStyle = element.strokeStyle;
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
    }
  });
  if (isMoving == true && elements[currentIndex] != undefined) {
    elements[currentIndex].X =
      e.clientX - canvas.offsetLeft + canvas.clientLeft;
    elements[currentIndex].Y = e.clientY - canvas.offsetTop + canvas.clientTop;
    elements[currentIndex].lineWidth = 5;
    elements[currentIndex].strokeStyle = "black";
  } else {
  }
}
function resetSelect() {
  elements.forEach((element) => {
    if (element.type === "circle") {
      element.strokeStyle = "blue";
    } else {
      element.strokeStyle = "green";
    }
    element.lineWidth = 0;
    fillTheGround(event);
  });
}
document.addEventListener("mouseup", (e) => {
  let leftSide = onCanvas ? 0 : -200;
  if (isMoving) {
    if (
      e.clientX - elemLeft > 400 ||
      e.clientX - elemLeft < leftSide ||
      e.clientY - elemTop > 400 ||
      e.clientY - elemTop < 0
    ) {
      if (confirm("do you want to delete this item?")) {
        localStorage.clear();
        elements.splice(currentIndex, 1);
        fillTheGround(e);
      }
      isMoving = false;
      return "";
    }
  }
});
function savePos() {
  elements.forEach((element) => {
    localStorage.setItem(
      `${elements.indexOf(element)}`,
      `${element.type},${element.X},${element.Y}`
    );
  });
}
function getDataFromStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    let string = localStorage.getItem(i).split(",");
    let color = "";
    if (string[0] == "circle") {
      color = "blue";
    } else {
      color = "green";
    }
    elements.push({
      type: string[0],
      X: string[1],
      Y: string[2],
      lineWidth: 0,
      strokeStyle: color,
    });
    fillTheGround();
  }
}

function ExportData() {
  return JSON.stringify(elements)
}
function ImportData(){
    for(let i = 0; i < JSON.parse(textarea.value).length; i++){
        elements[i] = JSON.parse(textarea.value)[i]
    }
}