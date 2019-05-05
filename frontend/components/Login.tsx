import React from 'react';

interface ILoginStateProps {}
interface ILoginActions {}
interface ILoginState {}
interface ILoginProps extends ILoginStateProps, ILoginActions {}

class Login extends React.Component<ILoginProps, ILoginState> {
	public state: ILoginState = {
	};

	constructor(props: ILoginProps) {
		super(props);
	}

	public render() {
		return (<React.Fragment>
			{'<Login /> -- access /login to log in'}
		</React.Fragment>);
	}
}

export default Login;
