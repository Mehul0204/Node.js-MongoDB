const express = require('express');
const router = express.Router();
const Task = require('../models/task');

/* GET home page. */
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.render('index', { 
      tasks,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const task = new Task({
      taskName: req.body.taskName
    });
    await task.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/tasks/:id/complete', async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      completed: true,
      completedAt: Date.now()
    });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/tasks/:id/delete', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;