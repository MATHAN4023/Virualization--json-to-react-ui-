import React, { useRef } from "react";
import { Line } from 'react-chartjs-2';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";
import myImage from './logo/background.png';
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { io } from "socket.io-client";
import 'chartjs-plugin-annotation';
import 'font-awesome/css/font-awesome.min.css';
import html2canvas from 'html2canvas';


function Dashboard({ handlelogout }) {
    const socket = io('http://localhost:5000/');

    // State to track the active list item
    const [activeListItem, setActiveListItem] = useState(null);

    // Function to handle list item click
    const handleListItemClick = (index) => {
        setActiveListItem(index);
    }

    // state
    const [vnow, setvnow] = useState();
    const [vopen, setvopen] = useState();
    const [ishort, setishort] = useState();
    const [pmax, setpmax] = useState([]);
    const [vmaxp, setvmaxp] = useState([]);
    const [imaxp, setimaxp] = useState();
    const [eff, seteff] = useState();
    const [ff, setff] = useState();
    const [powerdata, setpowerdata] = useState();
    const [ocv, setocv] = useState();
    const [scc, setscc] = useState();
    const [seconds, setSeconds] = useState(0);

    // data
    const [alldata, setalldata] = useState();
    const [current, setcurrent] = useState();
    const [voltage, setvoltage] = useState();
    const [power1, setpower1] = useState();

    const [command, setcommand] = useState(true)
    const chartRef = useRef(null);

    const booleanseconds = useRef(false)

    //graph state
    const [datas, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Current',
                data: [],
                fill: false,
                yAxisID: 'y',
                borderColor: 'blue',
                pointRadius: 2,
                tension: 0.4,
            },
            {
                label: 'Power',
                data: [],
                fill: false,
                yAxisID: 'y1',
                borderColor: 'red',
                pointRadius: 2,
                tension: 0.4,
            },
        ],
    });


    const calculatevalues = () => {
        const powermax = Math.max(...power1)
        setpmax((powermax).toFixed(3));
        const indexOfMaxValue = power1.indexOf(powermax);
        setvmaxp((voltage[indexOfMaxValue]).toFixed(3));
        setimaxp((current[indexOfMaxValue]).toFixed(3));
        const indexOfMinVoltage = voltage.indexOf(Math.max(...voltage));
        const indexOfMincurrent = voltage.indexOf(Math.min(...current));
        setocv(voltage[indexOfMinVoltage]);
        setscc(current[indexOfMincurrent].toFixed(3));
        setff((powermax / (ocv * scc)).toFixed(3));
        seteff((powermax / (1.960192 * 1000) * 100).toFixed(3));
    }


    const sendresponse = async () => {
        const body = { command }
        booleanseconds.current = true;
        const loader = document.getElementById("loader");
        loader.style.display = "block";
        loader.style.display = "flex";

        socket.emit('send-message-react', true)


        setTimeout(() => {
            if (booleanseconds.current) {
                receiveresponse();
            }
        }, 5000);
    }

    //export function
    const exportData = () => {
        const filename = 'SolarAnalyser.csv';
        const csv = Papa.unparse(alldata);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    const receiveresponse = async () => {
        const loader = document.getElementById("loader");
        socket.emit('send-message-react', false)
        const response = await fetch('http://localhost:4000/api/data')
        const data = await response.json();
        setalldata(data);

        const filteredData = data.map(item => item.Current);
        setcurrent(filteredData);

        const filteredData1 = data.map(item => item.Voltage);
        setvoltage(filteredData1)

        const filteredData2 = data.map(item => parseFloat(item.Power));
        setpower1(filteredData2);

        loader.style.display = "none";
        booleanseconds.current = false;
        calculatevalues(data);
        setgraphdata(data);
    }

    const setgraphdata = (data) => {
        setData({
            labels: data.map(item => item.Voltage),
            datasets: [
                {
                    label: 'Current',
                    data: data.map(item => item.Current),
                    fill: false,
                    yAxisID: 'y',
                    borderColor: 'blue',
                    pointRadius: 2,
                    tension: 0.4,
                },
                {
                    label: 'Power',
                    data: data.map(item => item.Power),
                    fill: false,
                    yAxisID: 'y1',
                    borderColor: 'red',
                    pointRadius: 2,
                    tension: 0.4,
                },
            ],
        });
    }



    useEffect(() => {
        socket.on('message-to-react', (socketdata) => {
            console.log(socketdata);
        });
        return () => {
            socket.off('message-to-react');
        };
    }, []);


    const options = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    boxWidth: 20,
                    usePointStyle: false,
                    padding: 10,
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                    generateLabels: (chart) => {
                        const data = chart.data;
                        if (data.datasets.length) {
                            return data.datasets.map((dataset, i) => ({
                                text: dataset.label,
                                fillStyle: dataset.borderColor,
                                hidden: !chart.isDatasetVisible(i),
                                index: i,
                                datasetIndex: i,
                            }));
                        }
                        return [];
                    },
                },
            },

        },
        scales: {
            x: {

                type: "linear",
                position: "bottom",

                title: {
                    display: true,
                    text: "Voltage(V)",
                    color: 'black',
                    font: {
                        weight: '100',
                        size: "25px"
                    },
                },
                ticks: {

                    stepSize: 5,

                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                    beginAtZero: true,
                },
            },
            y: {
                beginAtZero: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Current(I)',
                    color: 'black',
                    font: {
                        weight: '100',
                        size: "25px"
                    },
                },
                ticks: {
                    stepSize: 1,
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                },


            },
            y1: {
                grid: {
                    display: false
                },
                beginAtZero: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Power(W)',
                    color: 'black',
                    font: {
                        weight: '100',
                        size: "25px"
                    },
                },
                ticks: {
                    stepSize: 10,
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                },
            },
        },
        grid: {
            display: false,
            borderWidth: 1,
        },
    };

  
    // const saveimage =()=>{
    //     window.confirm("are sure want to save the image?");
    // }

     // You may need to import this library

function saveimage() {
  // Select the element containing the graph (assuming it's an HTML element)
  const graphElement = document.getElementById('your-graph-id'); // Replace with your actual element ID

  // Use html2canvas to capture the graph as an image
  html2canvas(graphElement)
    .then((canvas) => {
      // Convert the canvas to a data URL
      const imageDataURL = canvas.toDataURL('image/png'); // You can change the format if needed

      // Create an anchor element to trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = imageDataURL;
      downloadLink.download = 'graph.png'; // Set the desired file name

      // Trigger the download
      downloadLink.click();
    })
    .catch((error) => {
      console.error('Error saving image:', error);
    });
}




    return (
        <div className="boddy">

            <div className="heading_1">
                <h5>Welcome To</h5>
            </div>
            <div className="heading_2">
                <h1>Solar Module Analyser</h1>
            </div>

            <div className="backimage">
                <img src={myImage} alt="My Image" />
            </div>



            <div className="width-100">
                <div className="nav-bar">
                    <ul>
                        <li
                            style={{ cursor: "pointer" }}
                            className={`list ${activeListItem === 0 ? 'active' : ''}`}
                            onClick={() => handleListItemClick(0)}
                        >
                            <a href="#card_id"><span className="icons"><i className="fa fa-home"></i></span>
                                <span className="content">Home</span></a>
                        </li>
                        <li
                            style={{ cursor: "pointer" }}
                            className={`list ${activeListItem === 1 ? 'active' : ''}`}
                            onClick={() => handleListItemClick(1)}
                        >
                            <a href="#graph"><span className="icons"><i className="fa fa-line-chart"></i></span>
                                <span className="content">Graph</span></a>

                        </li>
                        <li
                            style={{ cursor: "pointer" }}
                            className={`list ${activeListItem === 2 ? 'active' : ''}`}
                            onClick={() => handleListItemClick(2)}
                        >
                            <a href="#Calculation"><span className="icons"><i className="fa fa-calculator"></i></span>
                                <span className="content">Calculation</span></a>

                        </li>
                        <li
                            style={{ cursor: "pointer" }}
                            className={`list ${activeListItem === 3 ? 'active' : ''}`}
                            onClick={handlelogout}
                        >

                            <span className="icons"><i className="fa fa-sign-out"></i></span>
                            <span className="content" >Logout</span>
                        </li>
                    </ul>

                </div>
            </div>




            <div class="card" id="card_id">
                <div class="container">
                    <h1 className="text_card">About Us</h1>
                    <br /><br />
                    <p class="para">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Our Solar Module Analyzer project is pivotal for efficient solar energy utilization. We collect real-time data from solar panels and graphically display power and current trends. These graphs offer clear insights into panel performance over time, aiding in performance evaluation and anomaly detection. Moreover, our project includes complex calculations to assess efficiency and predict maintenance needs. This comprehensive tool empowers us to optimize energy production and ensure the sustainability of our solar systems."
                    </p>
                </div>
            </div>

            <br /><br /><br /><br /><br />

            <div className="graphs" id="graph">

                <h1 className="text_card">Graph</h1>

                <div id="loader" className="loader">
                    <div className="loading"></div>
                </div>


                <div className="content">
                    <div className="graph">
                        <Line data={datas} options={options} />
                    </div>
                </div>
                <br /><br /><br />
                <div className="buttons1">
                    <div className="sec-bar">
                        <button className="btn-loc start" onClick={sendresponse}>Start</button>
                    </div>
                    <div className="sec-bar">
                        <button className="btn-loc start btn btn-primary" onClick={exportData}>Export</button>
                    </div>
                    <div className="sec-bar" style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn-loc start btn btn-warning" onClick={saveimage}>Save graph</button>
                    </div>


                </div>
            </div>

            <br /><br /><br /><br /><br /><br />

            <div className="Calculation" id="Calculation">
                <h1 className="text_card">Calculation</h1>

                <div className="content">
                    <div className="values">
                        <div className="card clue">
                            <h2>OCV</h2>
                            <div className="inner-card">
                                <div className="value">{ocv}</div>
                                <div className="symbols">V</div>
                            </div>
                        </div>
                        <div className="card clue">
                            <h2>SCC</h2>
                            <div className="inner-card">
                                <div className="value">{scc}</div>
                                <div className="symbols">V</div>
                            </div>
                        </div>
                        {/* <div className="card clue">
                            <h2>Ishort</h2>
                            <div className="inner-card">
                                <div className="value">733.0</div>
                                <div className="symbols">mA</div>
                            </div>
                        </div> */}
                        <div className="card clue">
                            <h2>Pmax</h2>
                            <div className="inner-card">
                                <div className="value">{pmax}</div>
                                <div className="symbols">W</div>
                            </div>
                        </div>
                        <div className="card clue">
                            <h2>Vmaxp</h2>
                            <div className="inner-card">
                                <div className="value">{vmaxp}</div>
                                <div className="symbols">V</div>
                            </div>

                        </div>
                        <div className="card clue">
                            <h2>Imaxp</h2>
                            <div className="inner-card">
                                <div className="value">{imaxp}</div>
                                <div className="symbols">mA</div>
                            </div>

                        </div>
                        <div className="card clue">
                            <h2>Efficiency (EFF)</h2>
                            <div className="inner-card">
                                <div className="inner-card">
                                    <div className="value">{eff}</div>
                                    <div className="symbols">%</div>
                                </div>
                            </div>

                        </div>
                        <div className="card clue">
                            <h2>Fill Factor</h2>
                            <div className="inner-card">
                                <div className="value">{ff}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div >

            <footer>
                <div className="footer-content">
                    <p>&copy; 2023 Quantanic Techsherv Pvt Ltd. All rights reserved.</p>
                </div>
            </footer>
        </div >
    )
}


export default Dashboard;
