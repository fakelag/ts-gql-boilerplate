import React, { useState } from 'react';
import axios from 'axios';
import TextBox from './TextBox';

interface ILoginProps {}

const Login = (prop: ILoginProps) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const performLogin = async () => {
		try {
			await axios.post('/login', {
				name: username,
				passwd: password,
			});

			window.location.href = '/';
		} catch (err) {
			setError(err.message);
		}
	};

	return (<React.Fragment>
		<div style={{
				display: 'flex',
				flexDirection: 'column',
				height: '10rem',
				justifyContent: 'space-between',
				marginLeft: 'auto',
				marginRight: 'auto',
				marginTop: '10rem',
				width: '20rem',
			}}
		>
			<TextBox
				isEditable
				placeHolder="Username..."
				startsEditing={false}
				onChange={(value: string) => setUsername(value)}
			/>
			<TextBox
				isEditable
				placeHolder="Password..."
				startsEditing={false}
				onChange={(value: string) => setPassword(value)}
			/>
			<button className="LoginButton" onClick={performLogin}>
				<div className="Center">Log In</div>
			</button>
			<div className="ErrorMessage">
				{error}
			</div>
		</div>
	</React.Fragment>);
};

export default Login;
