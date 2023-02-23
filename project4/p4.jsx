import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';
import Switch from './components/Switch';
// import States from './components/states/States';
import Header from './components/header/Header';

ReactDOM.render(
	<div>
		<Header />
		<Switch />
	</div>,
	document.getElementById('reactapp'),
);
