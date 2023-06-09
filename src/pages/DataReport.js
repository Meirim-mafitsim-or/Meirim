import { Doughnut, Bar, Line } from "react-chartjs-2";
import 'chart.js/auto';
import React from "react";
import { useState } from 'react';
import { useContext } from 'react';
import strings from '../static/Strings.json';
import { LanguageContext } from '../common/LanguageContext';
import citys from '../static/city.json';
import { useEffect } from 'react';
import { ToggleButton, ButtonGroup, Row } from "react-bootstrap";
import { getEvents } from '../common/Database';

const options = {
    plugins: {
        legend: {
            labels: {
                // This more specific font property overrides the global property
                font: {
                    size: 20
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
};


export default function DataReport() {
    const { language } = useContext(LanguageContext);
    const [campersNum, setCampersNum] = useState([]);
    const [settlement, setSettlement] = useState([]);
    const [familiesNum, setFamiliesNum] = useState([]);
    const [numOfEventsInHalfYear, setNumOfEventsInHalfYear] = useState([]);
    const [labels, setLabels] = useState([]); //[strings.january[language], strings.february[language], strings.march[language], strings.april[language], strings.may[language], strings.june[language], strings.july[language], strings.august[language], strings.september[language], strings.october[language], strings.november[language], strings.december[language]
    const [settlementCount, setSettlementCount] = useState([]);
    const [colors, setColors] = useState([]); //["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"
    const [chartTypeCampers, setChartTypeCampers] = useState("bar");
    const [chartTypeFamilies, setChartTypeFamilies] = useState("bar");


    const campersData = {
        labels: settlement,
        datasets: [
            {
                label: strings.campers[language],
                data: campersNum,
                fill: true,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 1
            },
        ]
    };

    const familiesData = {
        labels: settlement,
        datasets: [
            {
                label: strings.families[language],
                data: familiesNum,
                fill: true,
                backgroundColor: [
                    "rgba(54, 162, 235, 0.2)",
                ],
                borderColor: [
                    "rgba(54, 162, 235, 1)",
                ],
                borderWidth: 1
            },
        ]
    };
    // const uniqueSettlement = [...new Set(settlement)];
    const settlementData = {
        labels: Object.keys(settlementCount),
        datasets: [
            {
                label: strings.settlements[language],
                data: Object.keys(settlementCount).map(settlement => settlementCount[settlement]),
                fill: true,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
                options: {
                    aspectRatio: 3.4,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            },
        ]
    };
    const eventsInYearData = {
        labels: labels,
        datasets: [
            {
                label: strings.number_of_events[language],
                data: numOfEventsInHalfYear,
                fill: true,
                backgroundColor: [
                    "rgba(106, 90, 205, 0.4)",
                ],
                borderColor: [
                    "rgba(106, 90, 205, 0.8)",
                ],
                borderWidth: 1
            },
        ]
    };

    useEffect(() => {
        const fetchEventData = async () => {
            const Events = await getEvents();
            setCampersNum(Events.map(event => event.campers.length));
            setSettlement(Events.map(event => event.settlement));
            setFamiliesNum(Events.map(event => event.families.length));
            if (language === "he") {
                setSettlement(Events.map((event) => citys.values.filter((city) => city.english_name === event.settlement).map((city) => city.name)[0]));
            }
          
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            const lastYear = new Date(currentYear - 1, (currentMonth+1)%12, 1);

            const eventsInYear = Events.filter(event => event.date.toDate() >= lastYear);
            let labels = [0,1,2,3,4,5,6,7,8,9,10,11].map(month => (currentMonth+month + 1)%12);
            const eventsGroupByMonth = labels.map(month => eventsInYear.filter(event => event.date.toDate().getMonth() === month).length);
            setNumOfEventsInHalfYear(eventsGroupByMonth);
            if (language === "he") {
                labels = labels.map(month => strings.months[language][month]);
            }
            else
                labels = labels.map(month => strings.months[language][month]);
            setLabels(labels);

        };
        fetchEventData();
    }, [language]);

    useEffect(() => {
        let settlementCount = {};
        settlement.forEach(event => {
            if (settlementCount[event]) {
                settlementCount[event]++;
            } else {
                settlementCount[event] = 1;
            }
        });
        setSettlementCount(settlementCount);
        let count = Object.keys(settlementCount).length;
        const collors = [];
        for (let i = 0; i < count; i++) {
            let color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ","
                + Math.floor(Math.random() * 255) + ",0.2)";
            if (!collors.includes(color))
                collors.push(color);
        }
        setColors(collors);
    }, [settlement]);

    return (
        <>
            <Row>
                <div className="w-50">
                    <h1 className="title">{strings.campers_per_event[language]}</h1>
                    {chartTypeCampers === "bar" ? (
                        <Bar data={campersData} options={options} />
                    ) : (
                        <Line data={campersData} options={options} />
                    )}
                    <ButtonGroup aria-label="Basic example">
                        <ToggleButton variant="outline-secondary" onClick={() => setChartTypeCampers("bar")} checked={chartTypeCampers === "bar"} size="sm">
                            <i className="bi bi-bar-chart-line"></i>
                        </ToggleButton>
                        <ToggleButton variant="outline-secondary" onClick={() => setChartTypeCampers("line")} checked={chartTypeCampers === "line"} size="sm">
                            <i className="bi bi-graph-up"></i>
                        </ToggleButton>
                    </ButtonGroup>
                </div>

                <div className="w-50">
                    <h1 className="title">{strings.families_per_event[language]}</h1>
                    {chartTypeFamilies === "bar" ? (
                        <Bar data={familiesData} options={options} />
                    ) : (
                        <Line data={familiesData} options={options} />
                    )}
                    <ButtonGroup aria-label="Basic example">
                        <ToggleButton variant="outline-secondary" onClick={() => setChartTypeFamilies("bar")} checked={chartTypeFamilies === "bar"} size="sm">
                            <i className="bi bi-bar-chart-line"></i>
                        </ToggleButton>
                        <ToggleButton variant="outline-secondary" onClick={() => setChartTypeFamilies("line")} checked={chartTypeFamilies === "line"} size="sm">
                            <i className="bi bi-graph-up"></i>
                        </ToggleButton>
                    </ButtonGroup>
                </div>
            </Row>
            <Row className="mb-3">
                <div className="w-50">
                {/* //do Doughnut for the settlements */}
                <div className="w-5 col-md-12 doughnut-chart-container" >
                    <h1 className="title mb-5">{strings.settlements[language]}</h1>
                    <Doughnut data={settlementData} options={settlementData.datasets[0].options} />
                </div>
                </div>
                <div className="w-50" >
                    <h1 className="title">{strings.events_in_year[language]}</h1>
                    <Bar data={eventsInYearData} options={options} />
                </div>
            </Row>

        </>
    );
}
