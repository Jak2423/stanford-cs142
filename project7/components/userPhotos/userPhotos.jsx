import React from 'react';
import {
	Grid,
	Card,
	CardHeader,
	Avatar,
	CardMedia,
	CardContent,
	Typography,
	Divider,
	MobileStepper,
	Button,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './userPhotos.css';

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */

class UserPhotos extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userPhotos: [],
			user: {},
			step: 0,
		};
		this.handleBack = this.handleBack.bind(this);
		this.handleNext = this.handleNext.bind(this);
	}

	componentDidMount() {
		axios
			.get(`/user/${this.props.match.params.userId}`)
			.then((response) => {
				this.setState({ user: response.data });
				this.props.onTitleChange(
					`Photos of ${this.state.user.first_name} ${this.state.user.last_name}`,
				);
			})
			.catch((e) => {
				console.log(e);
			});

		axios
			.get(`/photosOfUser/${this.props.match.params.userId}`)
			.then((response) => {
				this.setState({ userPhotos: response.data });
			})
			.catch((e) => {
				console.log(e);
			});
	}

	handleNext() {
		this.setState((prevState) => ({
			step: prevState.step + 1,
		}));
	}

	handleBack() {
		this.setState((prevState) => ({
			step: prevState.step - 1,
		}));
	}

	render() {
		return (
			<Grid className='photos-container'>
            {!this.state.userPhotos.length ? (
               <p></p>
            ): !this.props.checked ? (
                  this.state.userPhotos.map((photo) => (
                     <Card key={photo._id} style={{ width: '560px' }}>
                        <CardHeader
                           avatar={(
                              <Avatar style={{ background: 'transparent' }}>
                                 <PersonIcon fontSize='large' color='primary' />
                              </Avatar>
                           )}
                           subheader={photo.date_time}
                        />
                        <Link to={`/photo/${photo._id}`}>
                           <CardMedia
                              component='img'
                              height='auto'
                              image={`/images/${photo.file_name}`}
                              alt={photo._id}
                           />
                        </Link>
                        {photo.comments &&
                           photo.comments.map((comment) => (
                              <Card key={comment._id} className='comment-section'>
                                 <Link
                                    to={`/users/${comment.user_id}`}
                                    style={{ textDecoration: 'none' }}
                                 >
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
                     </Card>
                  ))
               ) : (
                  <div>
                     {this.state.userPhotos.map((photo, index) => (
                        <Card key={photo._id} style={{ width: '560px' }}>
                           {Math.abs(this.state.step - index) < 1 ? (
                              <div>
                                 <CardHeader
                                    avatar={(
                                       <Avatar style={{ background: 'transparent' }}>
                                          <PersonIcon fontSize='large' color='primary' />
                                       </Avatar>
                                    )}
                                    subheader={photo.date_time}
                                 />
                                 <CardMedia
                                    component='img'
                                    height='auto'
                                    image={`/images/${photo.file_name}`}
                                    alt={photo._id}
                                 />
                                 {photo.comments
                                    ? photo.comments.map((comment) => (
                                          <Card key={comment._id} className='comment-section'>
                                             <Link
                                                to={`/users/${comment.user_id}`}
                                                style={{ textDecoration: 'none' }}
                                             >
                                                <CardHeader
                                                   avatar={(
                                                      <Avatar style={{ background: 'transparent' }}>
                                                         <PersonIcon
                                                            fontSize='medium'
                                                            color='action'
                                                         />
                                                      </Avatar>
                                                   )}
                                                   title={`${comment.user.first_name} ${comment.user.last_name}`}
                                                   subheader={comment.date_time}
                                                />
                                             </Link>
                                             <CardContent className='comment'>
                                                <Typography variant='body2'>
                                                   {comment.comment}
                                                </Typography>
                                             </CardContent>
                                             <Divider />
                                          </Card>
                                      ))
                                    : null}
                              </div>
                           ) : null}
                        </Card>
                     ))}
                     <MobileStepper
                        steps={this.state.userPhotos.length}
                        activeStep={this.state.step}
                        position='static'
                        nextButton={(
                           <Button
                              size='small'
                              onClick={this.handleNext}
                              disabled={this.state.step === this.state.userPhotos.length - 1}
                           >
                              {' '}
                              Next <KeyboardArrowRight />
                           </Button>
                        )}
                        backButton={(
                           <Button
                              size='small'
                              onClick={this.handleBack}
                              disabled={this.state.step === 0}
                           >
                              <KeyboardArrowLeft /> Back
                           </Button>
                        )}
                     />
                  </div>
               )}
			</Grid>
		);
	}
}

export default UserPhotos;
