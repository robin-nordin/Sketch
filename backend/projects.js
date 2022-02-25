const Canvas = require('./models/Canvas');
const { validateToken } = require('./token');

module.exports = (app) => {
  app.post('/api/save', validateToken, async (req, res) => {

    const { user } = res.locals;
    const { canvas, title, id } = req.body;
    if (!canvas) return res.json({ success: false, message: 'Canvas is missing, cannot save sketch.' });

    const name = !title ? 'Untitled' : title;
    const data = { email: user, canvas, title: name };
    if (!id) {
      const db = new Canvas(data);
      try {
        await db.save();
        return res.json({ success: true, message: 'Successfully saved sketch.', id: db._id });
      } catch (error) {
        return res.json({ success: false, message: error });
      }
    } else {
      const [project] = await Canvas.find({ _id: id });
      if (!project) return res.json({ success: false, message: 'Cannot find sketch.' });
      if (project.email !== user)
        return res.json({ success: false, message: 'Incorrect e-mail associated with sketch.' });
      try {
        await Canvas.findOneAndUpdate({ _id: id }, { ...data });
        return res.json({ success: true, message: 'Successfully updated sketch.', id });
      } catch (error) {
        return res.json({ success: false, message: error });
      }
    }
  });

  app.get('/api/projects', validateToken, async (req, res) => {
    const { user } = res.locals;
    const projects = await Canvas.find({ email: user });
    res.json({ success: true, message: 'Successfully fetched data.', data: projects });
  });

  app.delete('/api/delete', validateToken, async (req, res) => {
    const { user } = res.locals;
    const { id } = req.body;
    if (!id) return res.json({ success: false, message: 'ID is missing, cannot delete sketch.' });
    const [project] = await Canvas.find({ _id: id });
    if (!project) return res.json({ success: false, message: 'Cannot find sketch.' });
    if (project.email !== user)
      return res.json({ success: false, message: 'Incorrect e-mail associated with sketch.' });
    try {
      await Canvas.findOneAndDelete({ _id: id });
      return res.json({ success: true, message: 'Successfully deleted sketch.' });
    } catch (error) {
      return res.json({ success: false, message: error });
    }
  });
};
