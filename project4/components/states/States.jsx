import React from 'react';
import './States.css';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
	constructor(props) {
		super(props);
		console.log('window.cs142models.statesModel()', window.cs142models.statesModel());

		this.state = {
			statesModel: window.cs142models.statesModel(),
			filteredModel: window.cs142models.statesModel(),
			substr: '',
		};
	}

	filterStates = (event) => {
		this.setState({ substr: event.target.value });
		this.setState({
			filteredModel: this.state.statesModel.filter((state) => state.toLowerCase().includes(this.state.substr.toLowerCase())),
		});
	};

	render() {
		return (
			<div className='container'>
				<input className='input-field' type='text' placeholder='search states...' onChange={this.filterStates} />
				<div className='list-container'>
					{this.state.filteredModel.length ? (
						this.state.filteredModel.map((stateModel) => (
							<p key={stateModel} className='list-item'>
								{stateModel}
							</p>
						))
					) : (
						<p className='no-result'>Хайлт олдсонгүй!</p>
					)}
				</div>
			</div>
		);
	}
}

export default States;
