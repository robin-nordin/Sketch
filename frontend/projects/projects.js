document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.token;
  if (!token) return (location.href = '/login');

  const response = await fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json();
  if (data.success) {
    renderProjects(data.data);
  }
});

const wrapper = document.querySelector('.wrapper');
function renderProjects(data) {
  data.forEach((element) => {
    const project = document.createElement('div');

    const image = document.createElement('img');
    image.src = element.canvas;

    const info = document.createElement('div');

    const span = document.createElement('span');
    span.innerText = element.title;

    const button = document.createElement('button');
    button.innerText = 'Edit';

    button.addEventListener('click', () => {
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
