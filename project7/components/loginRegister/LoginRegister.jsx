import React from 'react';
import { TextField, Container, Typography, Button } from '@material-ui/core';
import axios from 'axios';
import './LoginRegister.css';

class LoginRegister extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isNewUser: false,
			viewText: 'Register',
			loginName: '',
			loginPassword: '',
			newLoginName: '',
			firstName: '',
			lastName: '',
			location: '',
			description: '',
			occupation: '',
			newPassword: '',
			newPassword2: '',
			message: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
		this.changeView = this.changeView.bind(this);
	}

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	handleSubmit(event) {
		event.preventDefault();

		axios
			.post('/admin/login', {
				login_name: this.state.loginName,
				password: this.state.loginPassword,
			})
			.then((response) => {
            localStorage.setItem('user', JSON.stringify(response.data));
				this.setState({ message: '' });
				this.setState({ loginName: '' });
				this.setState({ loginPassword: '' });
				this.props.changeUser(response.data);
				this.props.changeLoggedIn(true);
			})
			.catch((err) => {
				this.setState({ message: 'Incorrect username or password' });
				console.log(err);
			});
	}

	handleRegister(event) {
		event.preventDefault();

      if(this.state.newPassword === this.state.newPassword2) {
         axios
            .post('/user', {
               login_name: this.state.newLoginName,
               password: this.state.newPassword,
               first_name: this.state.firstName,
               last_name: this.state.lastName,
               location: this.state.location,
               description: this.state.description,
               occupation: this.state.occupation,
            })
            .then((res) => {
               this.setState({ isNewUser: false });
               this.setState({ viewText: 'Register' });
               this.setState({message: res.data});
               this.setState({
                  firstName: '',
                  lastName: '',
                  location: '',
                  description: '',
                  occupation: '',
                  newLoginName: '',
                  newPassword: '',
                  newPassword2: '',
               });
            })
            .catch((err) => {
               this.setState({ message: err });
               console.log(err);
            });
      }
      else {
         this.setState({message: 'Those passwords didn’t match. Try again.'});
         this.setState({newPassword2: ''});
      }
	}

	changeView() {
		if (this.state.isNewUser) {
			this.setState({ isNewUser: false });
			this.setState({ viewText: 'Register' });
		} else {
			this.setState({ isNewUser: true });
			this.setState({ viewText: 'Sign in' });
		}
      this.setState({ message: '' });

	}

	render() {
		return (
			<Container component='main' maxWidth='xs' className='login-container'>
				{!this.state.isNewUser ? (
					<section className='login-section'>
						<Typography variant='h5'>Log In:</Typography>
						<form className='form' onSubmit={(event) => this.handleSubmit(event)}>
							<TextField
								required
								autoFocus
								fullWidth
								type='text'
								name='loginName'
								value={this.state.loginName}
								onChange={this.handleChange}
								margin='normal'
								variant='outlined'
								label='Username'
							/>
							<TextField
								required
								fullWidth
								type='password'
								name='loginPassword'
								value={this.state.loginPassword}
								onChange={this.handleChange}
								margin='normal'
								variant='outlined'
								label='Password'
							/>
                     {this.state.message && (
                        <Typography variant='subtitle1' color='secondary'>
                           {this.state.message}
                        </Typography>
                     )}
							<Button variant='contained' color='primary' label='submit' type='submit'>
								Log In
							</Button>
						</form>
					</section>
				) : (
					<section>
						<Typography variant='h5'>Register:</Typography>
						<form className='form' onSubmit={(event) => this.handleRegister(event)}>
							<TextField
								required
								fullWidth
								type='text'
								name='newLoginName'
								value={this.state.newLoginName}
								onChange={this.handleChange}
								margin='normal'
								variant='outlined'
								label='Username'
							/>
							<TextField
								required
								fullWidth
								type='text'
								name='firstName'
								value={this.state.firstName}
								onChange={this.handleChange}
								margin='normal'
								variant='outlined'
								label='First name'
							/>
							<TextField
								required
								fullWidth
								type='text'
								name='lastName'
								value={this.state.lastName}
								onChange={this.handleChange}
								margin='normal'
								variant='outlined'
								label='Last name'
							/>
							<TextField
								required
								fullWidth
								type='text'
								name='location'
								value={this.state.location}
								onChange={this.handleChange}
								margin='normal'
								variant='outlined'
								label='Location'
							/>
							<TextField
								required
								fullWidth
								type='text'
								name='occupation'
								value={this.state.occupation}
								onChange={this.handleChange}
								margin='normal'
								variant='outlined'
								label='Occupation'
							/>
							<TextField
								required
								fullWidth
								type='text'
								name='description'
								value={this.state.description}
								onChange={this.handleChange}
								margin='normal'
								variant='outlined'
								label='Description'
							/>
							<TextField
								required
								fullWidth
								type='password'
								name='newPassword'
								value={this.state.newPassword}
								onChange={this.handleChange}
								margin='normal'
								variant='outlined'
								label='Password'
							/>
							<TextField
								required
								fullWidth
								type='password'
								name='newPassword2'
								value={this.state.newPassword2}
								onChange={this.handleChange}
								margin='normal'
								variant='outlined'
								label='Confirm password'
							/>
                     {this.state.message && (
                        <Typography variant='subtitle1' color='secondary'>
                           {this.state.message}
                        </Typography>
                     )}
							<Button variant='contained' color='primary' label='submit' type='submit'>
                        Register me
							</Button>
						</form>
					</section>
				)}
				<Button variant='text' color='primary' type='button' onClick={this.changeView}>
					{this.state.viewText}
				</Button>
			</Container>
		);
	}
}

export default LoginRegister;
