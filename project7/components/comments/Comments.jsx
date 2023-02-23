import React from 'react';
import {  Card, CardMedia, CardContent, Typography, Grid} from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Comments.css';



class Comments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
         comments : []
		};
	}

   componentDidMount() {
     this.componentDidUpdate();
   }

   componentDidUpdate(){
      axios.get(`/commentsofUser/${this.props.match.params.userId}`)
      .then((response) => {
         this.setState({comments: response.data});
      })
      .catch((e) => {
         console.log(e);
      });
   }

	render() {
		return (
            <Grid className='photos-container'>
               {this.state.comments.map((comment) => (
                  <Card key={comment._id} style={{ display: 'flex', height: '120px', width:'80%' }}>
                     <Link to={`/photo/${comment.photo_id}`}>
                      <CardMedia component='img' height='auto' image={`/images/${comment.file_name}`} alt={comment._id} style={{width: '120px', height:'100%'}}/>
                     </Link>
                     <Card className='comment-section'>
                        <Link to={`/users/${comment.user_id}`} style={{ textDecoration: 'none' }}>
                        </Link>
                        <CardContent className='comment' style={{flex:'1 0 auto'}}>
                           <Typography variant='caption'>{comment.date_time}</Typography>
                           <Typography variant='body2' className='comment-text'>{comment.comment}</Typography>
                        </CardContent>
                     </Card>
                  </Card>
               ))}
            </Grid>
		);
	}
}

export default Comments;
