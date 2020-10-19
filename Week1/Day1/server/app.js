const express = require('express');
const app = express();
const cors = require('cors');

let tasks = [];
let counter = 0;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(tasks);
});

app.post('/', (req, res) => {
    let task = {"id": counter,
                "taskName": req.body.taskName,
                "class": "pending",
                "priority": req.body.priority,
                "date": req.body.date};
    counter++
    tasks.push(task);
    res.json({success: true});
})

app.delete('/tasks/:id', (req, res) => {
    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].id == req.params.id) {
            tasks.splice(i, 1)
        };
    };

    res.json({success: true});
});

app.listen(3000, () => {
    console.log('Server is running...');
});