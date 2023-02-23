import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link } from 'react-router-dom';
import './styles/main.css';
import Example from './components/example/Example';
import States from './components/states/States';
import Header from './components/header/Header';

ReactDOM.render(
	<HashRouter>
		<Header />
		<Route path='/states' component={States} />
		<Route path='/example' component={Example} />
		<div className='navigation'>
			<Link to='/states'>States</Link>
			<Link to='/example'>Example</Link>
		</div>
	</HashRouter>,
	document.getElementById('reactapp'),
);
