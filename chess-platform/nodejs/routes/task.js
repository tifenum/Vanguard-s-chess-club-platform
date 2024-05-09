const express = require('express');
const router = express.Router();
const TTask = require('../models/task');
const multer = require('multer');

let filename = '';

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
        let date = Date.now();
        let fl = date + '.' + file.originalname.split('.')[1];
        callback(null, fl);
        filename = filename ? filename + ',' + fl : fl;
    },
});

const upload = multer({ storage: storage });

router.post('/createtask', upload.single('attachments'), (req, res) => {
    const data = req.body;
    const newTask = new TTask(data);

    newTask.attachments = filename;

    newTask.save()
        .then(savedTask => {
            res.status(200).send(savedTask);
        })
        .catch(err => {
            res.status(400).send(err);
            console.error(err);
        });

    filename = '';
});

router.post('/addcomment/:id/:currentUserId', async (req, res) => {
    const taskId = req.params.id;
    const currentUserId = req.params.currentUserId;
    const commentData = req.body;

    try {
        const task = await TTask.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const existingCommentIndex = task.comments.findIndex(comment => comment.CommenterId === currentUserId);

        if (existingCommentIndex !== -1) {
            const existingComment = task.comments[existingCommentIndex];
            existingComment.text = commentData.text;
            existingComment.timestamp = commentData.timestamp;
            existingComment.edited = 'edited';
        } else {
            const newComment = {
                user: commentData.user,
                text: commentData.text,
                timestamp: commentData.timestamp,
                edited: '',
                supprime: false,
                CommenterId: currentUserId,
            };

            task.comments.push(newComment);
        }

        const updatedTask = await task.save();
        res.status(201).json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getAllTasks', async (req, res) => {
  try {
    const tasks = await TTask.find();
    const tasksWithAttachments = tasks.map(task => {
      return {
        _id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        category: task.category,
        attachments: task.attachments ? `${task.attachments}` : null,
        selectedOwner: task.selectedOwner,
        createrId: task.createrId,
        creater: task.creater,
        comments: task.comments
      };
    });

    res.status(200).json(tasksWithAttachments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/deletetask/:id/:userId', async (req, res) => {
    const taskId = req.params.id;
    const userId = req.params.userId;
  
    try {
      const task = await TTask.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      if (task.createrId !== userId) {
        return res.status(403).json({ error: 'Permission denied' });
      }
        await TTask.findByIdAndDelete(taskId);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.put('/updatetask/:id', async (req, res) => {
    const taskId = req.params.id;
    const updateData = req.body;
  
    try {
      const task = await TTask.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      task.title = updateData.title || task.title;
      task.description = updateData.description || task.description;
      task.dueDate = updateData.dueDate || task.dueDate;
      task.priority = updateData.priority || task.priority;
      task.status = updateData.status || task.status;
      task.category = updateData.category || task.category;
      task.attachments = updateData.attachments || task.attachments;
      task.selectedOwner = updateData.selectedOwner || task.selectedOwner;
      task.createrId = updateData.createrId || task.createrId;
      task.creater = updateData.creater || task.creater;      
      if (updateData.comments) {
        task.comments.user = updateData.comments.user || task.comments.user;
        task.comments.text = updateData.comments.text || task.comments.text;
      }
        const updatedTask = await task.save();
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.get('/gettaskbyid/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
      const task = await TTask.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


router.delete('/deletecomment/:taskId/:commentId', async (req, res) => {
  const { taskId, commentId } = req.params;

  try {
    const task = await TTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const comment = task.comments.find(comment => comment._id == commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    task.comments.pull(comment);
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

module.exports = router;