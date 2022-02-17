const offline = document.getElementById('offline');
const online = document.getElementById('online');
const welcome = document.getElementById('welcome');
const continueSketching = document.getElementById('continue-sketching');

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.token;
  if (token) {
    const response = await fetch('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.success) {
      offline.classList.add('hide');
      online.classList.remove('hide');
      welcome.innerText = `Welcome ${data.user}!`;
    } else {
      delete localStorage.token;
    }
  }
  const canvas = localStorage.canvas;
  if (canvas) {
    continueSketching.classList.remove('hide');
  }
});

function clearCanvas() {
  delete localStorage.title;
  delete localStorage.id;
  delete localStorage.canvas;
  location.href = '/canvas';
}
