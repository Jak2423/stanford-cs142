import React from 'react';
import {  Card, CardHeader, Avatar, CardMedia, CardContent, Typography, Divider, TextField, Button} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
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
		};
       this.addComment =  this.addComment.bind(this);
       this.handleInput =  this.handleInput.bind(this);
       this.refresh = this.refresh.bind(this);
	}

   componentDidMount() {
      axios.get(`/photo/${this.props.match.params.photoId}`)
         .then((response) => {
            this.setState({userPhoto: response.data});
         })
         .catch((e) => {
            console.log(e);
         });
   }

   refresh() {
      axios.get(`/photo/${this.props.match.params.photoId}`)
         .then((response) => {
            this.setState({userPhoto: response.data});
         })
         .catch((e) => {
            console.log(e);
         });
   }


   handleInput(event) {
		this.setState({ comment: event.target.value });
	}

   addComment(event, photo_id) {
		event.preventDefault();
		axios
			.post(`/commentsOfPhoto/${photo_id}`, {comment: this.state.comment})
			.then(() => {
				this.setState({ comment: '' });
            this.refresh();
			})
			.catch((err) => {
				console.log(err);
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
                  <CardMedia component='img' height='auto' image={`/images/${this.state.userPhoto.file_name}`} alt={this.state.userPhoto._id} />
                  {this.state.userPhoto.comments
                     && this.state.userPhoto.comments.map((comment) => (
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
                              </CardContent>
                              <Divider />
                           </Card>
                     ))}
                  <form onSubmit={(event) => this.addComment(event, this.state.userPhoto._id)} className='form-comment'>
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
                        endIcon={<SendIcon/>}
                     >
                        Send
                     </Button>
                  </form>
            </Card>
		);
	}
}

export default UserPhoto;
