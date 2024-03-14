import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Fullchart extends Component {
	constructor() {
		super();
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
        const { moduleName } = this.props;
		const options = {
			animationEnabled: true,
			theme: "light2",
			title: {
				text: moduleName
			},
			axisY: {
				title: "Percentage (%)", 
				labelFormatter: this.addSymbols,
				minimum: 0, 
				maximum: 100 
			},
			axisX: {
				title: "",
				labelAngle: 0
			},
			data: [{
				type: "column",
				dataPoints: data.map(item => ({ label: item.sdlc_type, y: item.weighted_percent }))
			}]
		}

		return (
			<div className='mt-5'>
				<div className='container '>
					<CanvasJSChart options={options} />
				</div>
			</div>
		);
	}
}

export default Fullchart;
