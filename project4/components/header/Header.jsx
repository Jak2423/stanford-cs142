import React from 'react';
import './Header.css';

class Header extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className='header'>
				<img src='../../assets/duck.gif' alt='' />
				<p className='motto'>Think different</p>
			</div>
		);
	}
}

export default Header;
