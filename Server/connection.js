const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json())
app.use(cors())



app.get('/api/data', async (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(`C:\\Users\\91936\\Desktop\\new_data_540W.json`, 'utf8'));
        res.json(data);
    } catch (error) {
        console.log("error")
    }
})



app.listen(4000, () => {
    console.log("server is running on 5000")
})