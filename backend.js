const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Route to handle setting reminders
app.post('/setReminder', (req, res) => {
    const { time } = req.body;
    // Load reminders from file
    let reminders = [];
    try {
        reminders = JSON.parse(fs.readFileSync('reminders.json', 'utf8'));
    } catch (err) {
        console.error('Error reading reminders file:', err);
    }
    
    // Add new reminder
    reminders.push({ time });
    
    // Write updated reminders to file
    fs.writeFile('reminders.json', JSON.stringify(reminders), 'utf8', (err) => {
        if (err) {
            console.error('Error writing reminders to file:', err);
            return res.status(500).json({ error: 'Failed to set reminder' });
        }
        console.log(`Reminder set for ${time}`);
        res.status(200).json({ message: `Reminder set for ${time}` });
    });
});

// Route to get all reminders (for demonstration purposes)
app.get('/reminders', (req, res) => {
    try {
        const reminders = JSON.parse(fs.readFileSync('reminders.json', 'utf8'));
        res.status(200).json(reminders);
    } catch (err) {
        console.error('Error reading reminders file:', err);
        res.status(500).json({ error: 'Failed to retrieve reminders' });
    }
});
fetch('reminders.json')
  .then(response => response.json())
  .then(data => {
    // Do something with the data from the reminders.json file
    console.log(data);
  })
  .catch(error => {
    console.error('Error fetching reminders.json:', error);
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
