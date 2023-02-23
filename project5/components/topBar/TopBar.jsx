import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import './TopBar.css';
import fetchModel from '../../lib/fetchModelData';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
         // currentURL: window.location.href,
         // user: {},
			version: '',

		};
		// this.contentTitle = this.contentTitle.bind(this);

	}
	componentDidMount() {
		fetchModel('/test/info')
			.then((response) => {
				this.setState({
					version: response.data.__v,
				});
			})
			.catch((e) => {
				console.log(e);
			});
         // this.componentDidUpdate();
	}

   // componentDidUpdate(){
   //   this.setState({title: this.contentTitle});
   // }

   // contentTitle() {
   //    var currentURL = this.state.currentURL;
   //    if (currentURL.includes('/users/')) {
   //       fetchModel(`/user/${currentURL.substring(currentURL.indexOf('/users/') + '/users/'.length)}`)
   //          .then((response) => {
   //             this.setState({ user: response.data });
   //          })
   //          .catch((e) => {
   //             console.log(e);
   //          });

   //          return`${this.state.user.first_name} ${this.state.user.last_name}`;
   //    }
   //    if (currentURL.includes('/photos/')) {
   //       fetchModel(`/user/${currentURL.substring(currentURL.indexOf('/photos/') + '/photos/'.length)}`)
   //          .then((response) => {
   //             this.setState({ user: response.data });
   //          })
   //          .catch((e) => {
   //             console.log(e);
   //          });

   //       return`Photos of ${this.state.user.first_name} ${this.state.user.last_name}`;
   //    }

   //    return '';
   // }

	render() {
		return (
			<AppBar className='cs142-topbar-appBar' position='absolute'>
				<Toolbar className='header'>
					<Typography variant='h4' color='inherit' className='logo'>
						Javkhlan
					</Typography>
					{/* <Typography variant='h6' color='inherit' className='logo'>
						{this.contentTitle}
					</Typography> */}
					<Typography variant='h6' color='inherit' className='title'>
						Photo Application: v{this.state.version}
					</Typography>
				</Toolbar>
			</AppBar>
		);
	}
}

export default TopBar;
