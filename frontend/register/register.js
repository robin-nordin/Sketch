const email = document.querySelector('#email'); // Input field
const password = document.querySelector('#password'); // Input field
const submit = document.querySelector('#submit'); // Button to submit your registration
const error = document.querySelector('#error'); // Sends the error message if the requirements are not met
const form = document.querySelector('form');

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.token;
  if (token) return (location.href = '/'); // If you're trying to go to register when being logged in you get redirected to landing
});

// Functionality for the submit button. When you succeed to register a new account you get redirected to the canvas
submit.addEventListener('click', async function () {
  const body = JSON.stringify({ email: email.value, password: password.value }); // Makes data to strings since we store it in localStorage
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
  console.log(body);
  console.log(data);
  console.log(email.value);
  console.log(password.value);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
});
