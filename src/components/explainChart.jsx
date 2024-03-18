import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class Fullchart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.addSymbols = this.addSymbols.bind(this);
    }

    componentDidMount() {
        this.fetchData(); 
    }

    componentDidUpdate(prevProps) {
        if (prevProps.moduleId !== this.props.moduleId) {
            this.fetchData(); 
        }
    }

    fetchData() {
        const { moduleId } = this.props;
        fetch(`http://68.178.175.207:8000/get_LMS_sdlc_phase_list?module_id=${moduleId}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ data });
            })
            .catch(error => {
                console.log(error);
            });
    }

    addSymbols(e) {
        return e.value.toFixed(0) + "%"; 
    }

    render() {
        const { data } = this.state;
        const { moduleName, colors } = this.props;

        const seriesData = {
            data: data.map(item => item.weighted_percent)
        };

        const options = {
            chart: {
                height: 350,
                type: 'bar',
                events: {
                    click: function(chart, w, e) {
                        // console.log(chart, w, e)
                    }
                }
            },
            colors: colors,
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: data.map(item => item.sdlc_type),
                labels: {
                    style: {
                        colors: colors,
                        fontSize: '12px'
                    }
                }
            },
            yaxis: {
                min: 0,
                max: 100,
                labels: {
                    formatter: function(val) {
                        return val.toFixed(0) + "%";
                    }
                }
            },
            title: {
                text: moduleName,
                floating: true,
                offsetY: 330,
                align: 'center',
                style: {
                    color: '#444'
                }
            }
        };

        return (
            <div className='mt-5'>
                <div className='container' style={{width: "100%"}}>
                    <ReactApexChart options={options} series={[seriesData]} type="bar" height={350} />
                </div>
            </div>
        );
    }
}

export default Fullchart;
