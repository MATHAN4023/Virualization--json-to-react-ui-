// import React from "react";
// import { io } from "socket.io-client";


// function Sockettest() {

//     const socket = io('http://localhost:5000/');

//     socket.on('message', (socketdata) => {
//         console.log('Received data from socket:', socketdata);
//     });


//     socket.on('message-to-react', (socketdata) => {
//         console.log('Received data from socket:', socketdata);
//     });

//     const reveice = async(req,res)=>{
//         socket.emit('send-message-react',"hiii")
//     }

//     return (
//         <>
//             <div>hello</div>
//             <button onClick={reveice}>button</button>
//         </>

//     )
// }

// export default Sockettest;

