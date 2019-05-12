import React from 'react';
import Page from './Page';
import Login from '../components/Login';
import { Router, Route, Switch } from 'react-router';

import { default as router } from '../history';
import * as I from '../interfaces';

interface IAppStateProps {}
interface IAppActions {}
interface IAppState {}

interface IAppProps extends IAppStateProps, IAppActions {
	login: I.ILoginData;
}

class App extends React.Component<IAppProps, IAppState> {
	public state: IAppState = {
	};

	constructor(props: IAppProps) {
		super(props);
	}

	public componentDidMount = async () => {
		// subscribe to events
	}

	public componentWillUnmount = async () => {
		// unsubscribe
	}

	public render() {
		return (<React.Fragment>
			<Router history={router}>
				<Switch>
					<Route path="/login" component={Login}/>
					<Route path="*" component={Page}/>
				</Switch>
			</Router>
		</React.Fragment>);
	}
}

export default App;
