const express = require('express');
const Pool = require('pg').Pool
const cors=require('cors');

const app=express();
app.use(express.json())
app.use(cors())

const pool=new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'power_monitoring',
    password: 'gt55tt44',
    port: 5432,
})

app.post('/validatelogin',async(req,res)=>{
    const { username, password } = req.body;
    try {
        console.log(username,password)
        const validate=await pool.query('SELECT COUNT(*) FROM user_credential WHERE username=$1 and password=$2;',[username,password])
        const row_count = validate.rows[0]['count'];
        console.log(validate.rows[0]['count'])
        if(row_count == 1){
            res.json({message:200});
        }else{
            res.json({message:404});
        }
    } catch (error) {
        res.json({message:505});
        console.log(error)
    }
})

app.post('/api/start',async(req,res)=>{
    try {
        const command = req.body['command'];
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/stop',async(req,res)=>{
    try {
        res.json("message sent")
    } catch (error) {
        console.log("error")
    }
})



app.listen(5000,()=>{
    console.log("server is running on 5000")
})