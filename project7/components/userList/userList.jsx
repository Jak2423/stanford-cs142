import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import axios from 'axios';
import './userList.css';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			alert: '',
		};
		this.handleUploadButtonClicked = this.handleUploadButtonClicked.bind(this);
	}

	componentDidMount() {
		axios
			.get('/user/list')
			.then((response) => {
				this.setState({ users: response.data });
			})
			.catch((e) => {
				console.log(e);
			});
	}

	handleUploadButtonClicked = (event) => {
		event.preventDefault();

		if (this.uploadInput.files.length > 0) {
			const domForm = new FormData();
			domForm.append('uploadedphoto', this.uploadInput.files[0]);

			axios
				.post('/photos/new', domForm)
				.then((res) => {
					this.setState({ alert: res.data });
				})
				.catch((err) => console.log(`POST ERR: ${err}`));
		}
	};

	render() {
		return (
			<div>
				<List component='nav'>
					{this.state.users.map((user) => (
						<ListItem divider={true} key={user._id} className='list-item'>
							<ListItemAvatar>
								<Avatar style={{ background: 'transparent' }}>
									<PersonIcon fontSize='large' color='primary' />
								</Avatar>
							</ListItemAvatar>
							<Link to={`/users/${user._id}`} style={{ textDecoration: 'none' }}>
								<ListItemText primary={user.first_name + ' ' + user.last_name} />
							</Link>
							{this.props.checked ? (
								<div className='bubble'>
									<span className='bubble-photo'>{user.countOfPhotos}</span>
									<Link to={`/comments/${user._id}`}>
										<span className='bubble-commment'>{user.countOfComments}</span>
									</Link>
								</div>
							) : null}
						</ListItem>
					))}
				</List>
				<form
					className='upload-form'
					onSubmit={(event) => this.handleUploadButtonClicked(event)}
				>
					<input
						type='file'
						accept='image/*'
						ref={(domFileRef) => {
							this.uploadInput = domFileRef;
						}}
					/>
					<Button
						className='upload-btn'
						variant='contained'
						color='inherit'
						size='small'
						label='submit'
						type='submit'
					>
						upload
					</Button>
				</form>
				{this.state.alert && <p>{this.state.alert}</p>}
			</div>
		);
	}
}

export default UserList;
