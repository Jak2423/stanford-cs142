import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Grid, Typography, Paper, FormControlLabel, Checkbox } from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import UserPhoto from './components/userPhoto/userPhoto';
import Comments from './components/comments/Comments';

class PhotoShare extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			checked: false,

		};
		this.contentTitle = this.contentTitle.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
	}

	contentTitle(title) {
	   if(window.location.href === 'http://localhost:3000/photo-share.html#/') {
	      this.setState({title: ''});
	   }
	   else {
	      this.setState({title: title});
	   }
	}

   handleToggle() {
		this.setState((prevState) => ({
			checked: !prevState.checked,
		}));
	}

	render() {
		return (
			<HashRouter>
				<div>
					<Grid container spacing={8}>
						<Grid item xs={12}>
							<TopBar title={this.state.title} />
						</Grid>
						<div className='cs142-main-topbar-buffer' />
						<Grid item sm={3}>
							<Paper className='cs142-main-grid-item'>
								<UserList checked={this.state.checked}/>
								<FormControlLabel control={<Checkbox checked={this.state.checked} onChange={this.handleToggle} />} label='Enable Advanced Features' className='checkbox' />
							</Paper>
						</Grid>
						<Grid item sm={9}>
							<Paper className='cs142-main-grid-item'>
								<Switch>
									<Route
										exact
										path='/'
										render={() => (
											<Typography variant='body1'>
												Welcome to your photosharing app! This <a href='https://mui.com/components/paper/'>Paper</a> component displays the main content of the application. The {'sm={9}'}{' '}
												prop in the <a href='https://mui.com/components/grid/'>Grid</a> item component makes it responsively display 9/12 of the window. The Switch component enables us to
												conditionally render different components to this part of the screen. You don&apos;t need to display anything here on the homepage, so you should delete this Route
												component once you get started.
											</Typography>
										)}
									/>
									<Route path='/users/:userId' render={(props) => <UserDetail {...props} onTitleChange={this.contentTitle}/>} />
									<Route path='/photos/:userId' render={(props) => <UserPhotos {...props} onTitleChange={this.contentTitle} checked={this.state.checked}/>} />
									<Route path='/comments/:userId' render={(props) => <Comments {...props} />} />
									<Route path='/photo/:photoId' render={(props) => <UserPhoto {...props} />} />
								</Switch>
							</Paper>
						</Grid>
					</Grid>
				</div>
			</HashRouter>
		);
	}
}

ReactDOM.render(<PhotoShare />, document.getElementById('photoshareapp'));
