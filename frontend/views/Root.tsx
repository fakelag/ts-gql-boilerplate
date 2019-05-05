import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { subscriptionClient } from '../link';

import App from './App';
import Login from '../components/Login';

import * as I from '../interfaces';

const Q_LOGIN = gql`
	query GetLogin {
		login {
			token,
			user {
				name
			}
		}
	}
`;

interface IRootStateProps {}
interface IRootActions {}

interface IRootState {
	login: I.ILoginData | null;
}

interface IRootProps extends IRootStateProps, IRootActions {}

class Root extends React.Component<IRootProps, IRootState> {
	public state: IRootState = {
		login: null,
	};

	constructor(props: IRootProps) {
		super(props);
	}

	public login = (login: I.ILoginData) => {
		if (login && login.token) {
			subscriptionClient.on('connected', (a: any) => this.setState({ login }));
			subscriptionClient.on('reconnected', (a: any) => this.setState({ login }));
			subscriptionClient.connectionParams = () => login.token;
		} else {
			this.setState({ login: null });
		}
	}

	public render() {
		return (<React.Fragment>
			<Query query={Q_LOGIN}>
				{({ loading, error, data }) => {
					if (loading) return 'Loading...';
					if (error) return `Error! ${error.message}`;

					if (data && data.login && data.login.user) {
						if (!this.state.login)
							this.login(data.login);
					}

					if (!this.state.login)
						return <Login />;

					return <App login={this.state.login} />;
				}}
			</Query>
		</React.Fragment>);
	}
}

export default Root;
