import strings from '../static/Strings.json';
import { Doughnut, Bar, Line } from "react-chartjs-2";
import 'chart.js/auto';
import React, { useState, useContext, useEffect } from "react";
import { LanguageContext } from '../common/LanguageContext';
import citys from '../static/city.json';
import { ToggleButton, ButtonGroup, Row, Card, Col } from "react-bootstrap";
import { getEvents } from '../common/Database';

const options = {
    plugins: {
        legend: {
            labels: {
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
    const [settlementByDate, setSettlementByDate] = useState([]);
    const [familiesNum, setFamiliesNum] = useState([]);
    const [numOfEventsInHalfYear, setNumOfEventsInHalfYear] = useState([]);
    const [labels, setLabels] = useState([]);
    const [settlementCount, setSettlementCount] = useState([]);
    const [colors, setColors] = useState([]);
    const [chartTypeCampers, setChartTypeCampers] = useState("bar");
    const [chartTypeFamilies, setChartTypeFamilies] = useState("bar");
    const [chartTypeYear, setChartTypeYear] = useState("bar");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedSettlementForCampers, setSelectedSettlementForCampers] = useState(null);
    const [selectedSettlementForFamilies, setSelectedSettlementForFamilies] = useState(null);
    // const [feedbacks, setFeedbacks] = useState([]);

    const handleSettlementSelectForCampers = (event) => {
        const selectedValue = event.target.value;
        setSelectedSettlementForCampers(selectedValue);
    };
    const handleSettlementSelectForFamilies = (event) => {
        const selectedValue = event.target.value;
        setSelectedSettlementForFamilies(selectedValue);
    };

    //from 2022 to this year
    const availableYears = Array.from({ length: new Date().getFullYear() - 2021 }, (_, i) => 2022 + i);
    

    const campersData = {
        labels: settlementByDate,
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
        labels: settlementByDate,
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

    // const settlementData = {
    //     labels: Object.keys(settlementCount),
    //     datasets: [
    //       {
    //         label: strings.settlements[language],
    //         data: Object.keys(settlementCount).map(settlement => settlementCount[settlement]),
    //         fill: true,
    //         backgroundColor: colors,
    //         borderColor: colors,
    //         borderWidth: 1,
    //         options: {
    //           aspectRatio: 3.4,
    //           plugins: {
    //             legend: {
    //               display: true, // Display the legend
    //               position: 'right', // Position the legend on the right side
    //               align: 'start', // Align the legend items to the start
    //             },
    //           },
    //         },
    //       },
    //     ],
    //   };
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
            setFamiliesNum(Events.map(event => event.families.length));
            if (language === "he") {
                setSettlementByDate(Events.map(event => (citys.values.find(city => city.english_name === event.settlement).name) + " - " + event.date.toDate().toLocaleDateString()));
                setSettlement(Events.map(event => citys.values.find(city => city.english_name === event.settlement).name));
            }
            else {
                setSettlement(Events.map(event => event.settlement));
                setSettlementByDate(Events.map(event => (event.settlement) + " - " + event.date.toDate().toLocaleDateString()));
            }

            // const now = new Date();
            // const currentYear = now.getFullYear();
            // const currentMonth = now.getMonth();
            // const lastYear = new Date(currentYear - 1, (currentMonth + 1) % 12, 1);

            const eventsInYear = Events.filter(event => {
                const eventYear = event.date.toDate().getFullYear();
                return eventYear === selectedYear;
            });
            let labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
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

        // const fetchFeedbackData = async () => {
        //     const feedbacks = await getFeedbacks();
        //     setFeedbacks(feedbacks);
        // }
        // fetchFeedbackData();
    }, [language, selectedYear]);

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

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
    };

    return (
        <>
            <Card className="m-auto mt-5 w-75 p-4">
                <Row>
                    <div className="w-100">
                        <h1 className="title">{strings.campers_per_event[language]}</h1>
                        {chartTypeCampers === "bar" ? (
                            selectedSettlementForCampers ? (
                                campersData.datasets[0].data = campersNum.filter((_, index) => settlement[index] === selectedSettlementForCampers),
                                campersData.labels = settlementByDate.filter((_, index) => settlement[index] === selectedSettlementForCampers),
                                <Bar data={campersData} options={options} />
                            ) : (

                                <Bar data={campersData} options={options} />
                            )
                        ) : (
                            selectedSettlementForCampers ? (
                                campersData.datasets[0].data = campersNum.filter((_, index) => settlement[index] === selectedSettlementForCampers),
                                campersData.labels = settlementByDate.filter((_, index) => settlement[index] === selectedSettlementForCampers),
                                <Line data={campersData} options={options} />
                            )
                                : (

                                    <Line data={campersData} options={options} />
                                )
                        )}
                        <Row className='mt-4 mb-4'>
                            <Col xs={6} className="d-flex justify-content-start align-items-center">
                                <ButtonGroup className="me-2" aria-label="Basic example">
                                    <ToggleButton variant="outline-secondary" onClick={() => setChartTypeCampers("bar")} checked={chartTypeCampers === "bar"}>
                                        <i className="bi bi-bar-chart-line"></i>
                                    </ToggleButton>
                                    <ToggleButton variant="outline-secondary" onClick={() => setChartTypeCampers("line")} checked={chartTypeCampers === "line"}>
                                        <i className="bi bi-graph-up"></i>
                                    </ToggleButton>
                                </ButtonGroup>
                                <select className="form-select" value={selectedSettlementForCampers} onChange={handleSettlementSelectForCampers} style={{ width: 200 }}>
                                    <option value="">{strings.show_all_settlements[language]}</option>
                                    {[...new Set(settlement)].map((settlementOption) => (
                                        <option key={settlementOption} value={settlementOption}>
                                            {settlementOption}
                                        </option>
                                    ))}
                                </select>
                            </Col>
                        </Row>

                    </div>
                </Row>
                <Row className="mb-3">
                    <div >
                        <h1 className="title">{strings.families_per_event[language]}</h1>
                        {chartTypeFamilies === "bar" ? (
                            selectedSettlementForFamilies ? (
                                familiesData.datasets[0].data = familiesNum.filter((_, index) => settlement[index] === selectedSettlementForFamilies),
                                familiesData.labels = settlementByDate.filter((_, index) => settlement[index] === selectedSettlementForFamilies),
                                <Bar data={familiesData} options={options} />
                            ) : (

                                <Bar data={familiesData} options={options} />
                            )
                        ) : (
                            selectedSettlementForFamilies ? (
                                familiesData.datasets[0].data = familiesNum.filter((_, index) => settlement[index] === selectedSettlementForFamilies),
                                familiesData.labels = settlementByDate.filter((_, index) => settlement[index] === selectedSettlementForFamilies),
                                <Line data={familiesData} options={options} />
                            )

                                : (

                                    <Line data={familiesData} options={options} />

                                )
                        )}
                        <Row className='mt-4 mb-4'>
                            <Col xs={6} className="d-flex justify-content-start align-items-center">
                                <ButtonGroup className="me-2" aria-label="Basic example">
                                    <ToggleButton variant="outline-secondary" onClick={() => setChartTypeFamilies("bar")} checked={chartTypeFamilies === "bar"}>
                                        <i className="bi bi-bar-chart-line"></i>
                                    </ToggleButton>
                                    <ToggleButton variant="outline-secondary" onClick={() => setChartTypeFamilies("line")} checked={chartTypeFamilies === "line"}>

                                        <i className="bi bi-graph-up"></i>
                                    </ToggleButton>
                                </ButtonGroup>
                                <select className="form-select" value={selectedSettlementForFamilies} onChange={handleSettlementSelectForFamilies} style={{ width: 200 }}>
                                    <option value="">{strings.show_all_settlements[language]}</option>
                                    {[...new Set(settlement)].map((settlementOption) => (
                                        <option key={settlementOption} value={settlementOption}>
                                            {settlementOption}
                                        </option>
                                    ))}
                                </select>
                            </Col>
                        </Row>
                    </div>
                </Row>
                {/* <Row className="mb-3">
                    <div className="w-5 col-md-12 doughnut-chart-container" >
                        <h1 className="title mb-5">{strings.settlements[language]}</h1>
                        <Doughnut data={settlementData} options={settlementData.datasets[0].options} />
                    </div>
                </Row> */}
                <Row className="mb-3">
                    <div className="col-md-12 doughnut-chart-container">
                        <h1 className="title mb-5">{strings.settlements[language]}</h1>
                        <div className="d-flex justify-content-center align-items-center flex-wrap">
                            <Doughnut data={settlementData} options={settlementData.datasets[0].options} />
                            <div className="d-flex flex-wrap mt-4">
                                {Object.keys(settlementCount).map((settlement, index) => (
                                    <div key={settlement} className="d-flex align-items-center mb-2 me-4">
                                        <div
                                            className="legend-color"
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                backgroundColor: colors[index],
                                                marginRight: '8px',
                                            }}
                                        ></div>
                                        <div>{settlement}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Row>
                <Row className="mb-3">
                    <div >
                        <h1 className="title">{strings.events_in_year[language]}</h1>
                        {chartTypeYear === "bar" ? (
                            <Bar data={eventsInYearData} options={options} />
                        ) : (
                            <Line data={eventsInYearData} options={options} />
                        )}
                        <Row className='mt-4 mb-4'>
                            <Col xs={6} className="d-flex justify-content-start align-items-center">
                                <ButtonGroup className="me-2" aria-label="Basic example">
                                    <ToggleButton variant="outline-secondary" onClick={() => setChartTypeYear("bar")} checked={chartTypeYear === "bar"}>
                                        <i className="bi bi-bar-chart-line"></i>
                                    </ToggleButton>
                                    <ToggleButton variant="outline-secondary" onClick={() => setChartTypeYear("line")} checked={chartTypeYear === "line"}>
                                        <i className="bi bi-graph-up"></i>
                                    </ToggleButton>
                                </ButtonGroup>
                                <select id="year-select" className="form-select" onChange={handleYearChange} defaultValue={new Date().getFullYear()} style={{ width: 95 }}>
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </Col>
                        </Row>
                    </div>
                    {/* <Row className="mb-3"> */}
                    {/* <div className='p-10'>

                <Row style={{
                    height: '55vh',
                }}>
                {feedbacks.map((feedback, index) => (
                    <Col>
                    <Card key={index} className="text-center text-dark h-75 mb-3" >
                        <Card.Header>{feedback.event}</Card.Header>
                        <Card.Body style={{
                        overflowY: 'auto',
                        }}>
                            <Card.Title>{feedback.camper}</Card.Title>
                            <Container>
                            <Card.Text>
                                {feedback.feedback_expierence}
                            </Card.Text>
                            <Card.Text>
                                {feedback.feedback_other_comments}
                            </Card.Text>
                            <Card.Text>
                                {feedback.feedback_rate_shabat}
                            </Card.Text>
                            <Card.Text>
                                {feedback.feedback_same_camper}
                            </Card.Text>
                            </Container>
                        </Card.Body>
                    </Card>
                    </Col>
                    ))}
                </Row>
        </div> */}
        {/* reduce((rows, key, index) => (index % 4 === 0 ? rows.push([key])
                    : rows[rows.length - 1].push(key)) && rows, [])
                    .map((row, index) => (
                        <Row key={index} xs={1} md={4} >
                            {row.map((event, index) => (
                                <Col key={index} className="p-3" style={{backgroundColor: 'lightgrey'}}>
                                    <ui>
                                        <li>{event.feedback_expierence}</li>
                                        <li>{event.feedback_other_comments}</li>
                                        <li>{event.feedback_rate_shabat}</li>
                                        <li>{event.feedback_same_camper}</li>
                                    </ui>
                                    
                                </Col>
                                ))}
                        </Row>
                    ))
            } */}
                    {/* </Row> */}
                </Row>
            </Card>
        </>
    );
}

