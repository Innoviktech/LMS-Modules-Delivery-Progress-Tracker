import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class Fullchart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
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
                console.error("API Error:", error);
            });
    }
    render() {
        const { data } = this.state;
        const { moduleName } = this.props;
    
        // Function to map color names to hexadecimal values
        const mapColorToHex = (colorName) => {
            switch (colorName.toLowerCase()) {
                case 'amber':
                    return '#FFC107'; 
                case 'green':
                    return '#4CAF50'
                case 'red':
                    return '#F44336';
                default:
                    return '#808080'; // Default color (gray)
            }
        };
    
        // Extract colors from API response and map them to hexadecimal values
        const seriesColors = data.map(item => mapColorToHex(item.color || 'gray'));
    
        const seriesData = {
            data: data.map(item => item.weighted_percent),
            colors: seriesColors
        };
    
    
        const categories = data.map(item => item.sdlc_type);
    
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
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                }
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: categories,
                labels: {
                    style: {
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
            },
            colors: seriesColors  // Set colors globally for all series
        };

        return (
            <div className='mt-5' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className='container' style={{ width: '70%' }}>
                    <ReactApexChart options={options} series={[seriesData]} type="bar" height={350} />
                </div>
                {/* Remarks section */}
                <div style={{ width: '30%', paddingLeft: '20px' }}>
                    {data.map((module, index) => (
                        module.remarks && (
                            <div className="remark-section" key={index}>
                                <span className="circle" style={{ backgroundColor: "red", marginRight: '5px' }}>&#10687;</span>
                                REMARK : <span style={{ color: "red"}}>{module.remarks}</span>
                            </div>
                        )
                    ))}
                </div>
            </div>
        );
    }
}

export default Fullchart;
