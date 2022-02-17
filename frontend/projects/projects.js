document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.token;
  if (!token) return (location.href = '/login'); // If you're trying to go to projects w/o being logged in you get redirected to login

  const response = await fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } }); // If you have managed to log in it will render your projects tied to that email
  const data = await response.json();
  if (data.success) {
    renderProjects(data.data);
  }
});

const wrapper = document.querySelector('.wrapper'); // Creates wrapper in parent projects
function renderProjects(data) {
  data.forEach((element) => {
    const project = document.createElement('div'); // Creates wrapper for each project

    const image = document.createElement('img'); // creates img element for canvas
    image.src = element.canvas;

    const info = document.createElement('div');

    const span = document.createElement('span'); // Creates span element for title text
    span.innerText = element.title;

    const button = document.createElement('button'); // Creates button element for edit button
    button.innerText = 'Edit';

    button.addEventListener('click', () => {
      // Grabs selected project from LS with ID and canvas and redirects back to canvas with image
      localStorage.id = element._id;
      localStorage.canvas = element.canvas;
      localStorage.title = element.title;
      location.href = '/canvas';
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';

    deleteButton.addEventListener('click', async () => {
      const body = JSON.stringify({ id: element._id });
      const token = localStorage.token;
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      const data = await response.json();
      if (data.success) {
        delete localStorage.id;
        delete localStorage.canvas;
        delete localStorage.title;
        location.reload();
      }
    });

    info.append(span, button, deleteButton);
    project.append(image, info);
    wrapper.append(project);
  });
}
