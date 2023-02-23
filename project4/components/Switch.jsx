import React from 'react';
import '../styles/main.css';
import Example from './example/Example';
import States from './states/States';

class Switch extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			switched: false,
			viewName: 'Example',
		};
	}

	render() {
		return (
			<div>
				<button
					type='button'
					className='btn-switch'
					onClick={() => {
						if (this.state.switched) {
							this.setState({ switched: false });
							this.setState({ viewName: 'Example' });
						} else {
							this.setState({ switched: true });
							this.setState({ viewName: 'States' });
						}
					}}
				>
					Switch to {this.state.viewName}
				</button>
				{this.state.switched ? <Example /> : <States />}
			</div>
		);
	}
}

export default Switch;
