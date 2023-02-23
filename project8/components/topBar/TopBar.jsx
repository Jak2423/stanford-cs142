import React from 'react';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import './TopBar.css';
import axios from 'axios';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			info: '',
		};

		this.handleLogOut = this.handleLogOut.bind(this);
	}

	componentDidMount() {
		axios
			.get('/test/info')
			.then((response) => {
				this.setState({
					info: response.data,
				});
			})
			.catch((e) => {
				console.log(e);
			});
	}

	handleLogOut() {
		axios
			.post('/admin/logout', {})
			.then(() => {
				this.props.changeLoggedIn(false);
            localStorage.clear();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	render() {
		return (
			<AppBar className='cs142-topbar-appBar' position='absolute'>
				<Toolbar className='header'>
					<Typography variant='h5' color='inherit' className='logo'>
						{this.props.isLoggedIn
							? `Hi ${this.props.user.first_name} 👋`
							: 'Photo Application'}
					</Typography>
					<Typography variant='h6' color='inherit' className='logo'>
						{this.props.isLoggedIn ? this.props.title : 'Please Login'}
					</Typography>
					<div className='right-bar'>
						<Typography variant='h6' color='inherit' className='title'>
							v{this.state.info.version}
						</Typography>
						{this.props.isLoggedIn && (
							<Button
								className='logout-btn'
								variant='text'
								onClick={this.handleLogOut}
								color='inherit'
							>
								Logout
							</Button>
						)}
					</div>
				</Toolbar>
			</AppBar>
		);
	}
}

export default TopBar;
