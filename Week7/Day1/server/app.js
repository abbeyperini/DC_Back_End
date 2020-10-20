const express = require('express');
const app = express();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

let tasks = [];

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(tasks);
});

app.post('/', (req, res) => {
    if(req.body.taskName != null && req.body.priority != null & req.body.date != null) {
        let task = {"id": uuidv4(),
                    "taskName": req.body.taskName,
                    "class": "pending",
                    "priority": req.body.priority,
                    "date": req.body.date};
        tasks.push(task);
        console.log(res.json({success: true}));
    } else {
        console.log(res.json({success: false, errorMessage: 'Unable to add task'}))
    }
})

app.delete('/tasks/:id', (req, res) => {
    let taskId = req.params.id

    //filter todos and ignore the todo item with the taskID to be deleted
    tasks = tasks.filter(task => {
        return task.id != taskId
    })

    console.log(res.json({success: true}));
});

app.listen(3000, () => {
    console.log('Server is running...');
});