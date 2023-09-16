const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/data', async (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('C:\\Users\\mazzm\\Desktop\\solar1_data.json', 'utf8'));
        res.json(data);
    } catch (error) {
        console.error(error); // Log the actual error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/values', async (req, res) => {
    try {
        const data1 = JSON.parse(fs.readFileSync('C:\\Users\\mazzm\\Desktop\\solar1_data.json', 'utf8'));
        res.json(data1);
    } catch (error) {
        console.error(error); // Log the actual error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
