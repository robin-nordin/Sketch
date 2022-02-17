const Canvas = require('./models/Canvas');
const { validateToken } = require('./token');

module.exports = (app) => {
  app.post('/api/save', validateToken, async (req, res) => {
    // API call to save canvas
    const { user } = res.locals;
    const { canvas, title, id } = req.body;
    if (!canvas) return res.json({ success: false, message: 'Canvas is missing, cannot save project.' }); // If canvas is missing you can't save

    const name = !title ? 'Untitled' : title; // If there's no title entered in input field we give it name 'untitled'
    const data = { email: user, canvas, title: name };
    if (!id) {
      // If ID doesn't exist, we save a new image
      console.log(data);
      const db = new Canvas(data);
      try {
        // Tries to save project to DB
        await db.save();
        return res.json({ success: true, message: 'Successfully saved project.', id: db._id });
      } catch (error) {
        // If something goes wrong we get an error
        return res.json({ success: false, message: error });
      }
    } else {
      // If ID exist, grab existing project and replace
      const [project] = await Canvas.find({ _id: id });
      if (!project) return res.json({ success: false, message: 'Cannot find project.' });
      console.log('user:', user);
      console.log('project:', project);
      if (project.email !== user)
        return res.json({ success: false, message: 'Incorrect e-mail associated with project.' }); // Checks if email on project is the same, if not you get an error
      try {
        // Updates project
        await Canvas.findOneAndUpdate({ _id: id }, { ...data });
        return res.json({ success: true, message: 'Successfully updated project.', id });
      } catch (error) {
        // If somethings goes wrong in try{} we get error
        return res.json({ success: false, message: error });
      }
    }
  });

  app.get('/api/projects', validateToken, async (req, res) => {
    const { user } = res.locals;
    const projects = await Canvas.find({ email: user });
    res.json({ success: true, message: 'Successfully fetched data.', data: projects }); // If we have email we get data from DB
  });

  app.delete('/api/delete', validateToken, async (req, res) => {
    const { user } = res.locals;
    const { id } = req.body;
    if (!id) return res.json({ success: false, message: 'ID is missing, cannot delete project.' });
    const [project] = await Canvas.find({ _id: id });
    if (!project) return res.json({ success: false, message: 'Cannot find project.' });
    if (project.email !== user)
      return res.json({ success: false, message: 'Incorrect e-mail associated with project.' }); // Checks if email on project is the same, if not you get an error
    try {
      await Canvas.findOneAndDelete({ _id: id });
      return res.json({ success: true, message: 'Successfully deleted project.' });
    } catch (error) {
      // If somethings goes wrong in try{} we get error
      return res.json({ success: false, message: error });
    }
  });
};
