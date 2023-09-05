import React, { useRef } from "react";
import { Line } from 'react-chartjs-2';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";
import jsonData from './datas/new_data2.json';
import myImage from './logo/background.png';
import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import 'chartjs-plugin-annotation';
import 'font-awesome/css/font-awesome.min.css';


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

    const [command, setcommand] = useState(true)
    const chartRef = useRef(null);

    const booleanseconds = useRef(false)

    const current = jsonData.map(item => item.Current);
    const voltage = jsonData.map(item => item.Voltage);
    const power1 = jsonData.map(item => item.Power);

    const calculatevalues = () => {
        const powermax = Math.max(...power1)
        setpmax(powermax);
        const indexOfMaxValue = power1.indexOf(powermax);
        setvmaxp(voltage[indexOfMaxValue])
        setimaxp(current[indexOfMaxValue])
        const indexOfMinVoltage = voltage.indexOf(Math.min(...voltage));
        setocv(voltage[indexOfMinVoltage])
        const indexOfMincurrent = current.indexOf(Math.min(...current));
        setscc(current[indexOfMincurrent]);
        setff((pmax / (ocv * scc)).toFixed(3));
    }

    const sendresponse = async () => {
        const body = { command }
        booleanseconds.current = true;
        const loader = document.getElementById("loader");
        loader.style.display = "block";
        loader.style.display = "flex";

        socket.emit('send-message-react', true)
    }

    const exportData = () => {
        alert("exported successfully");
    }


    const receiveresponse = async () => {
        const loader = document.getElementById("loader");
        socket.emit('send-message-react', false)
        loader.style.display = "none";
        booleanseconds.current = false;
        setSeconds(0);
    }

    useEffect(() => {
        socket.on('message-to-react', (socketdata) => {
            console.log(socketdata);
        });
        return () => {
            socket.off('message-to-react');
        };
    }, []);


    const labels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]



    const data = {
        labels: voltage,
        datasets: [
            {
                label: 'Current',
                data: current,
                fill: false,
                yAxisID: 'y',
                borderColor: 'yellow',
                pointRadius: 2,
                tension: 0.4,
            },
            {
                label: 'Power',
                data: power1,
                fill: false,
                yAxisID: 'y1',
                borderColor: 'red',
                pointRadius: 2,
                tension: 0.4,
            },
        ],
    };


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
                        weight: '900',
                        size: "15px"
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
                        weight: '900',
                        size: "15px"
                    },
                },
                ticks: {
                    stepSize: 1,
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                },

                grid: {
                    display: true,
                },
            },
            y1: {
                beginAtZero: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Power(P)',
                    color: 'black',
                    font: {
                        weight: '900',
                        size: "15px"
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
            display: true,
            borderWidth: 1,
        },
    };

    useEffect(() => {
        calculatevalues()
        let intervalId;

        const incrementSeconds = () => {
            if (booleanseconds.current) {
                setSeconds(prevSeconds => prevSeconds + 1);
            }
        };

        intervalId = setInterval(incrementSeconds, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [])




    return (
        <div className="boddy" >

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
                            <span className="icons"><i className="fa fa-home"></i></span>
                            <span className="content">Home</span>
                        </li>
                        <li
                            style={{ cursor: "pointer" }}
                            className={`list ${activeListItem === 1 ? 'active' : ''}`}
                            onClick={() => handleListItemClick(1)}
                        >
                            <span className="icons"><i className="fa fa-line-chart"></i></span>
                            <span className="content">Graph</span>
                        </li>
                        <li
                            style={{ cursor: "pointer" }}
                            className={`list ${activeListItem === 2 ? 'active' : ''}`}
                            onClick={() => handleListItemClick(2)}
                        >
                            <span className="icons"><i className="fa fa-calculator"></i></span>
                            <span className="content">Calculation</span>
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




            <div class="card">
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
                    <button className="btn-loc stop" style={{ width: "fit-content" }} onClick={receiveresponse}>{seconds} sec - Stop</button>
                </div>


                <div className="content">
                    <div className="graph">
                        <Line data={data} options={options}  />
                    </div>
                </div>
                <div className="buttons1">
                    <div className="sec-bar">
                        <button className="btn-loc start" onClick={sendresponse}>Start</button>
                    </div>
                    <div className="sec-bar">
                        <button className="btn btn-primary" onClick={exportData}>Export</button>
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
                        <div className="card clue">
                            <h2>Ishort</h2>
                            <div className="inner-card">
                                <div className="value">733.0</div>
                                <div className="symbols">mA</div>
                            </div>
                        </div>
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
                            <h2>EFF</h2>
                            <div className="inner-card">
                                <div className="inner-card">
                                    <div className="value">0.078</div>
                                    <div className="symbols">%</div>
                                </div>
                            </div>

                        </div>
                        <div className="card clue">
                            <h2>FF</h2>
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
