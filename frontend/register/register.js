const email = document.querySelector('#email');
const password = document.querySelector('#password');
const submit = document.querySelector('#submit');
const error = document.querySelector('#error');
const form = document.querySelector('form');

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.token;
  if (token) return (location.href = '/');
});

submit.addEventListener('click', async function () {
  const body = JSON.stringify({ email: email.value, password: password.value });
  const response = await fetch('/auth/register', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (data.success) {
    localStorage.token = data.token;
    location.href = '/';
  } else {
    error.classList.remove('hide');
    error.innerText = data.message;
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
});
