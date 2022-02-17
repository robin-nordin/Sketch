const canvas = document.getElementById('canvas');
const color = document.getElementById('color');
const saveBtn = document.querySelector('.save'); // When button is clicked, canvas is saved to database

let currentColor = 'rgb(0,0,0)';

// makes sizing of canvas
canvas.height = 600;
canvas.width = 1200;
const ctx = canvas.getContext('2d');

// TODO -  HANDLE TITLE

// Grabs image from LS and inserts it in to canvas
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.canvas) return;
  console.log(localStorage.canvas);
  const image = new Image();
  image.src = localStorage.canvas;
  image.addEventListener('load', () => {
    ctx.drawImage(image, 0, 0);
  });
  document.querySelector('.title').value = localStorage.title;
});

// makes BG of canvas white so when you save the image it has white BG
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let prevX = null;
let prevY = null;

ctx.lineWidth = 5;
currentSize = 5;

let draw = false;

// button handlers
// let colorInput = document.querySelector('#color');
// let hexInput = document.querySelector('#hex');
// colorInput.addEventListener('input', () => {
//   let color = colorInput.value;
//   hexInput.value = color;
// });

document.getElementById('controlSize').addEventListener('input', function () {
  const spanElement = document.getElementById('showSize');
  currentSize = this.value;
  spanElement.innerText = 'Size ' + currentSize;
  if (currentSize <= 10) {
    spanElement.style.left = 'initial';
    spanElement.style.right = '0px';
  } else {
    spanElement.style.left = '0px';
    spanElement.style.right = 'initial';
  }
});

color.addEventListener('change', function () {
  currentColor = this.value;
  document.getElementById('color-wrapper').style.backgroundColor = currentColor;
});

let clearBtn = document.querySelector('.clear');
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  delete localStorage.id;
  delete localStorage.canvas;
  delete localStorage.title;
  document.querySelector('.title').value = '';
});

// Save drawing to database
saveBtn.addEventListener('click', async () => {
  const titleElement = document.querySelector('.title');
  const imgData = canvas.toDataURL();
  const id = localStorage.id;
  let title = '';
  if (!titleElement.value) {
    title = 'Untitled';
    titleElement.value = title;
  } else {
    title = titleElement.value;
  }
  const body = JSON.stringify({ canvas: imgData, id, title });
  const token = localStorage.token;
  const response = await fetch('/api/save', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (data.success) {
    localStorage.id = data.id;
    localStorage.canvas = imgData;
    localStorage.title = title;
    displayBanner();
  }
});

function displayBanner() {
  const element = document.querySelector('.canvasInfo');
  element.classList.remove('fade');
  void element.offsetWidth; // Required to restart a CSS animation
  element.classList.add('fade');
}

// Downloading drawing as image
let downloadBtn = document.querySelector('.download');
downloadBtn.addEventListener('click', () => {
  let data = canvas.toDataURL('image/jpeg', 1.0); // jpeg instead of png makes it not a vector
  let a = document.createElement('a');
  a.href = data;

  // what ever name you specify here the image will be saved as that name. Hardcoded name.
  a.download = 'sketch.jpg';
  a.click();
});

// Drawing functionality
// changed window.add to canvas.add because window targets everything and we only want to target canvas
canvas.addEventListener('mousedown', (e) => (draw = true));
canvas.addEventListener('mouseup', (e) => (draw = false));
canvas.addEventListener('mouseleave', (e) => (draw = false)); // when mouse leaves canvas it stops drawing
canvas.addEventListener('mousemove', (e) => {
  if (prevX == null || prevY == null || !draw) {
    prevX = e.offsetX;
    prevY = e.offsetY;
    return;
  }

  ctx.lineCap = 'round';
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentSize;

  let currentX = e.offsetX;
  let currentY = e.offsetY;
  // console.log('x', currentX);
  // console.log('y', currentY);

  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  prevX = currentX;
  prevY = currentY;
});

// Login functionality
// Grabs the button text and changes it to login or logout depending on what page you are on
const login = document.querySelector('#login');
if (localStorage.token) {
  login.innerText = 'Logout';
} else {
  saveBtn.disabled = true;
  login.innerText = 'Login';
}

// When button is pressed user is removed from localstorage but still remains in database
login.addEventListener('click', () => {
  if (localStorage.token) {
    delete localStorage.token;
    delete localStorage.id;
    delete localStorage.canvas;
    // Button text changes back to login and you are redirected to login
    location.href = '/';
  } else {
    location.href = '/login';
  }
});
