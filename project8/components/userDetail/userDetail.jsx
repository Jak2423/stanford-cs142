import React from 'react';
import { Button } from '@material-ui/core';
import './userDetail.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
		};
	}

	componentDidMount() {
		this.componentDidUpdate();
	}

	componentDidUpdate() {
		axios
			.get(`/user/${this.props.match.params.userId}`)
			.then((response) => {
				this.setState({ user: response.data });
				this.props.onTitleChange(`${this.state.user.first_name} ${this.state.user.last_name}`);
			})
			.catch((e) => {
				console.log(e);
			});
	}

	render() {
		return (
			<div className='container'>
				<h1>
					{this.state.user.first_name} {this.state.user.last_name}
				</h1>
				<p className='user-id'>{this.state.user._id}</p>
				<h2>Description</h2>
				<p className='description'>{this.state.user.description}</p>

				<div className='details'>
					<p>Work: {this.state.user.occupation}</p>
					<p>Location: {this.state.user.location}</p>
				</div>
				<Link to={`/photos/${this.state.user._id}`} style={{ textDecoration: 'none' }}>
					<Button variant='contained' color='primary' disableElevation>
						Veiw Photos
					</Button>
				</Link>
			</div>
		);
	}
}

export default UserDetail;
