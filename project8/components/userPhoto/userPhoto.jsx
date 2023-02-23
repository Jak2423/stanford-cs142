import React from 'react';
import {
	Card,
	CardHeader,
	Avatar,
	CardMedia,
	CardContent,
	Typography,
	Divider,
	IconButton,
	TextField,
	Button,
	CardActions,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import SendIcon from '@material-ui/icons/Send';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './userPhoto.css';

class UserPhoto extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userPhoto: {},
			comment: '',
         isUserLiked: false
		};
		this.addComment = this.addComment.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.refresh = this.refresh.bind(this);
		this.handleDeletePhoto = this.handleDeletePhoto.bind(this);
		this.handleDeleteComment = this.handleDeleteComment.bind(this);
		this.handleLikePhoto = this.handleLikePhoto.bind(this);
	}

	componentDidMount() {
		axios
			.get(`/photo/${this.props.match.params.photoId}`)
			.then((response) => {
				this.setState({ userPhoto: response.data });
            if(this.state.userPhoto.likedBy.includes(this.props.userId)) {
               this.setState({isUserLiked: true});
            }
            else {
               this.setState({isUserLiked: false});
            }
			})
			.catch((e) => {
				console.log(e);
			});
	}

	refresh() {
		axios
			.get(`/photo/${this.props.match.params.photoId}`)
			.then((response) => {
				this.setState({ userPhoto: response.data });
			})
			.catch((e) => {
				console.log(e);
			});
	}

	handleInput(event) {
		this.setState({ comment: event.target.value });
	}

	addComment(event) {
		event.preventDefault();
		axios
			.post(`/commentsOfPhoto/${this.props.match.params.photoId}`, {
				comment: this.state.comment,
			})
			.then(() => {
				this.setState({ comment: '' });
				this.refresh();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleDeletePhoto(event) {
		event.preventDefault();

		axios
			.delete(`/photo/${this.props.match.params.photoId}`)
			.then((response) => {
				console.log(response.data);
				window.location.replace('http://localhost:3000/photo-share.html#/');
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleDeleteComment(event, comment_id) {
		event.preventDefault();

		axios
			.delete(`/comment/${this.props.match.params.photoId}`, {
				data: { comment_id: comment_id },
			})
			.then(() => {
				this.refresh();
			})
			.catch((e) => {
				console.log(e);
			});
	}

	handleLikePhoto(event, isLike) {
		event.preventDefault();
		axios
			.post(`/like/${this.props.match.params.photoId}`, { like: isLike })
			.then(() => {
            this.setState({isUserLiked: isLike});
            this.refresh();
			})
			.catch((e) => {
				console.log(e);
			});
	}

	render() {
		return (
			<Card style={{ width: '560px' }} className='photo-container'>
				<CardHeader
					avatar={(
                  <Avatar style={{ background: 'transparent' }}>
							<PersonIcon fontSize='large' color='primary' />
                  </Avatar>
               )}
					subheader={this.state.userPhoto.date_time}
				/>
				<CardMedia
					component='img'
					height='auto'
					image={`/images/${this.state.userPhoto.file_name}`}
					alt={this.state.userPhoto._id}
				/>
				<CardActions disableSpacing>
					{this.state.isUserLiked ?  (
						<IconButton aria-label='like' color='secondary' onClick={(event) => this.handleLikePhoto(event, false)}>
							<FavoriteIcon />
						</IconButton>
					) : (
						<IconButton aria-label='like' color='secondary' onClick={(event) => this.handleLikePhoto(event, true)}>
							<FavoriteBorderIcon />
						</IconButton>
					)}
					{this.state.userPhoto.user_id === this.props.userId && (
						<Button
							variant='outlined'
							startIcon={<DeleteIcon />}
							onClick={this.handleDeletePhoto}
						>
							Delete
						</Button>
					)}
				</CardActions>
				{this.state.userPhoto.comments &&
					this.state.userPhoto.comments.map((comment) => (
						<Card key={comment._id} className='comment-section'>
							<Link to={`/users/${comment.user_id}`} style={{ textDecoration: 'none' }}>
								<CardHeader
									avatar={(
                              <Avatar style={{ background: 'transparent' }}>
											<PersonIcon fontSize='medium' color='action' />
                              </Avatar>
                           )}
									title={`${comment.user.first_name} ${comment.user.last_name}`}
									subheader={comment.date_time}
								/>
							</Link>
							<CardContent className='comment'>
								<Typography variant='body2'>{comment.comment}</Typography>
								{comment.user_id === this.props.userId && (
									<IconButton
										className='icon-btn'
										onClick={(event) => this.handleDeleteComment(event, comment._id)}
									>
										<DeleteIcon fontSize='small' />
									</IconButton>
								)}
							</CardContent>
							<Divider />
						</Card>
					))}
				<form onSubmit={this.addComment} className='form-comment'>
					<TextField
						variant='outlined'
						placeholder='Write a comment...'
						fullWidth
						type='text'
						value={this.state.comment}
						onChange={this.handleInput}
						multiline
					/>
					<Button
						className='send-btn'
						variant='contained'
						label='submit'
						type='submit'
						color='primary'
						endIcon={<SendIcon />}
					>
						Send
					</Button>
				</form>
			</Card>
		);
	}
}

export default UserPhoto;
