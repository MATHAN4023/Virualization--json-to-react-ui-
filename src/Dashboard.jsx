import React, { useRef } from "react";
import { Line } from 'react-chartjs-2';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";
import jsonData from './datas/new_data.json';
import { useState, useEffect } from 'react';
import { io } from "socket.io-client";

function Dashboard({ handlelogout }) {
    const socket = io('http://localhost:5000/');

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

    const booleanseconds = useRef(false)

    const current = jsonData.map(item => item.Current);
    const voltage = jsonData.map(item => item.Voltage);
    const power = jsonData.map(item => item.Voltage * item.Current);

    const calculatevalues = () => {
        const powermax = Math.max(...power)
        setpmax(powermax);
        const indexOfMaxValue = power.indexOf(powermax);
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

    
// Define the increment value
const increment = 5;

// Calculate the number of labels based on data length and increment
const numLabels = Math.ceil(voltage.length / increment);

// Generate the labels array starting from 0
const labels = Array.from({ length: numLabels }, (_, i) => i * increment);

const data = {
    labels: labels, // Custom x-axis labels starting from 0 with increments of 5
    datasets: [
        {
            label: 'Current',
            data: current,
            fill: false,
            borderColor: 'yellow',
            pointRadius: 2,
            tension: 0.4,
        },
        {
            label: 'Power',
            data: power,
            fill: false,
            borderColor: 'red',
            pointRadius: 2,
            tension: 0.4,
        },
        {
            label: 'voltage',
            data: voltage,
            fill: false,
            borderColor: 'green',
            pointRadius: 2,
            tension: 0.4,
        }
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
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                }
            },
            x: {
                beginAtZero: true,
                display: true,
                ticks: {
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                },
            },
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
            <div id="loader" className="loader">
                <button className="btn-loc stop" style={{ width: "fit-content" }} onClick={receiveresponse}>{seconds} sec - Stop</button>
            </div>
            <div className="top-bar">
                <button className=" btn-loc logout" onClick={handlelogout}> Logout</button>
            </div>
            <div className="sec-bar">
                <div className="heading">Solar Module Analyzer...</div>
                <button className="btn-loc start" onClick={sendresponse}>Start</button>
            </div>
            <div className="content">
                <div className="graph">
                    <Line data={data} options={options} />
                    <span className="display-flex" style={{ justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>voltage</span>
                </div>
                <div className="values">
                    <table className="data-table">
                        <tbody>
                            <tr>
                                <td className="datas">OCV</td>
                                <td>:</td>
                                <td >
                                    <div className="display-flex">
                                        <div className="value"> {ocv}</div>
                                        <div className="symbols">V</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="datas">SCC</td>
                                <td>:</td>
                                <td >
                                    <div className="display-flex">
                                        <div className="value">{scc}</div>
                                        <div className="symbols">V</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="datas">Ishort</td>
                                <td>:</td>
                                <td>
                                    <div className="display-flex">
                                        <div className="value">733.0</div>
                                        <div className="symbols">mA</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="datas">Pmax</td>
                                <td>:</td>
                                <td >
                                    <div className="display-flex">
                                        <div className="value">{pmax}</div>
                                        <div className="symbols">W</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="datas">Vmaxp</td>
                                <td>:</td>
                                <td >
                                    <div className="display-flex">
                                        <div className="value"> {vmaxp}</div>
                                        <div className="symbols">V</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="datas">Imaxp</td>
                                <td>:</td>
                                <td>
                                    <div className="display-flex">
                                        <div className="value">{imaxp}</div>
                                        <div className="symbols">mA</div>
                                    </div>

                                </td>
                            </tr>
                            <tr>
                                <td className="datas">EFF</td>
                                <td>:</td>
                                <td >
                                    <div className="display-flex">
                                        <div className="value">0.078</div>
                                        <div className="symbols">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="datas">FF</td>
                                <td>:</td>
                                <td >
                                    <div className="display-flex">
                                        <div className="value">{ff}</div>
                                        <div className="symbols"></div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="datas">Power</td>
                                <td>:</td>
                                <td >
                                    <div className="display-flex">
                                        <div className="value"> {power.slice(0,2)}</div>
                                        <div className="symbols">W</div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}

export default Dashboard;
