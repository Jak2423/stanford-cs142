import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Grid, Typography, Paper, FormControlLabel, Checkbox } from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import UserPhoto from './components/userPhoto/userPhoto';
import Comments from './components/comments/Comments';
import LoginRegister from './components/loginRegister/LoginRegister';

class PhotoShare extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			checked: false,
			isLoggedIn: false,
			user: {},
		};
		this.contentTitle = this.contentTitle.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
		this.changeUser = this.changeUser.bind(this);
		this.changeLoggedIn = this.changeLoggedIn.bind(this);
	}

	componentDidMount() {
		var loggedInUser = localStorage.getItem('user');

		if (loggedInUser) {
			var foundUser = JSON.parse(loggedInUser);

         this.setState({ user: foundUser });
         this.setState({ isLoggedIn: true });
		}
	}

	contentTitle(title) {
		this.setState({ title: title });
	}

	handleToggle() {
		this.setState((prevState) => ({
			checked: !prevState.checked,
		}));
	}

	changeLoggedIn(bool) {
		this.setState({ isLoggedIn: bool });
	}

	changeUser(data) {
		this.setState({ user: data });

	}

	render() {
		return (
			<HashRouter>
				<div>
					<Grid container spacing={8}>
						<Grid item xs={12}>
							<TopBar
								title={this.state.title}
								user={this.state.user}
								isLoggedIn={this.state.isLoggedIn}
								changeLoggedIn={this.changeLoggedIn}
							/>
						</Grid>
						<div className='cs142-main-topbar-buffer' />
						{this.state.isLoggedIn ? (
							<Grid item sm={3}>
								<Paper className='cs142-main-grid-item'>
									<FormControlLabel
										control={(
											<Checkbox
												checked={this.state.checked}
												onChange={this.handleToggle}
											/>
                              )}
										label='Enable Advanced Features'
										className='checkbox'
									/>
									<UserList
                              checked={this.state.checked}
                              userId={this.state.user._id}
                              changeLoggedIn={this.changeLoggedIn}
                           />
								</Paper>
							</Grid>
						) : null}
						{this.state.isLoggedIn ? (
							<Grid item sm={9}>
								<Paper className='cs142-main-grid-item'>
									<Switch>
										<Route
											exact
											path='/'
											render={() => (
												<Typography variant='body1'>
													Welcome to your photosharing app!
												</Typography>
											)}
										/>
										<Route
											path='/users/:userId'
											render={(props) => (
												<UserDetail {...props} onTitleChange={this.contentTitle} />
											)}
										/>
										<Route
											path='/photos/:userId'
											render={(props) => (
												<UserPhotos
													{...props}
													onTitleChange={this.contentTitle}
													checked={this.state.checked}
                                       userId={this.state.user._id}
												/>
											)}
										/>
										<Route
											path='/comments/:userId'
											render={(props) => <Comments {...props} />}
										/>
										<Route
											path='/photo/:photoId'
											render={(props) => <UserPhoto {...props} userId={this.state.user._id}/>}
										/>
									</Switch>
								</Paper>
							</Grid>
						) : (
							<Redirect to='/login-register' />
						)}
						{!this.state.isLoggedIn ? (
							<Grid item sm={12}>
								<Paper className='cs142-main-grid-item'>
									<Route
										path='/login-register'
										render={(props) => (
											<LoginRegister
												changeUser={this.changeUser}
												changeLoggedIn={this.changeLoggedIn}
												{...props}
											/>
										)}
									/>
								</Paper>
							</Grid>
						) : (
							<Redirect path='/login' to='/' />
						)}
					</Grid>
				</div>
			</HashRouter>
		);
	}
}

ReactDOM.render(<PhotoShare />, document.getElementById('photoshareapp'));
