import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import fetchModel from '../../lib/fetchModelData';
import './userList.css';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
		};
	}

	componentDidMount() {
		fetchModel('/user/list')
			.then((response) => {
				this.setState({ users: response.data });
			})
			.catch((e) => {
				console.log(e);
			});
	}

	render() {
		return (
			<div>
				<List component='nav'>
					{this.state.users.map((user) => (
						<ListItem divider={true} key={user._id}>
							<ListItemAvatar>
								<Avatar style={{ background: 'transparent' }}>
									<PersonIcon fontSize='large' color='primary' />
								</Avatar>
							</ListItemAvatar>
							<Link to={`/users/${user._id}`} style={{ textDecoration: 'none' }}>
								<ListItemText primary={user.first_name + ' ' + user.last_name} />
							</Link>
						</ListItem>
					))}
				</List>
			</div>
		);
	}
}

export default UserList;
