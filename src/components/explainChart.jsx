import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import "./explainchart.css"

class Fullchart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLabelRotationRequired: false,
        };
        this.chartRef = React.createRef();
    }

    componentDidMount() {
        this.fetchData();
        window.addEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.moduleId !== this.props.moduleId) {
            this.fetchData();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
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

    handleResize = () => {
        if (this.chartRef.current) {
            const chartWidth = this.chartRef.current.chart.width;
            const labelWidth = this.state.data.length * 130; // Assuming each label has 50px width
            const isLabelRotationRequired = labelWidth > chartWidth;
            if (isLabelRotationRequired !== this.state.isLabelRotationRequired) {
                this.setState({ isLabelRotationRequired });
            }
        }
    };

    render() {
        const { data, isLabelRotationRequired } = this.state;
        const { moduleName } = this.props;

        // Function to map color names to hexadecimal values
        const mapColorToHex = (colorName) => {
            switch (colorName.toLowerCase()) {
                case 'amber':
                    return '#FFC107';
                case 'green':
                    return '#4CAF50';
                case 'red':
                    return '#F44336';
                default:
                    return '#808080'; // Default color (gray)
            }
        };

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
                stacked: true,
                toolbar: {
                    show: false,
                },
                events: {
                    click: function (chart, w, e) {
                        // console.log(chart, w, e)
                    }
                }
            },
            // dataLabels: {
            //     enabled: true
            //   },
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
                categories:categories.map((item)=>item.includes(" ")?item.split(" "):item),
                labels: {
                    style: {
                        // fontSize: '13px',
                    //    paddingRight:"25px",
                    //     fontWeight: 400,
                    //     wordWrap:"break-word",
                    },
                    rotate:0,
                    show: true,
                    hideOverlappingLabels: false,
                    // formatter: function (value) {
                    //     return value.split('').join('\n');
                    // },
                }
            },
            yaxis: {
                min: 0,
                max: 100,
                labels: {
                    formatter: function (val) {
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
            colors: seriesColors,
            tooltip: {
                enabled: false,
                formatter: function (val) {
                    return val.toFixed(2) + '%'; 
                }
            }
        };

        return (
            <div className='mt-5' style={{ display: 'flex' }}>
                <div className='container' style={{ width: '70%' }} ref={this.chartRef}>
                    <ReactApexChart options={options} series={[seriesData]} type="bar" height={350} />
                </div>
                {/* Remarks section */}
                <div style={{ width: '20%', paddingLeft: '30px' }}>
                    {data.some(module => module.remarks) && (
                        <div className="remark-section">
                            <span className="remark-heading">Remark </span>
                            {data.map((module, index) => (
                                module.remarks && (
                                    <div key={index}>
                                        <div>* {module.sdlc_type} : {module.remarks}</div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Fullchart;
