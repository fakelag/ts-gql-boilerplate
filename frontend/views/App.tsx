import React from 'react';
import TextBox from '../components/TextBox';

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
			<div className="Page">
				<p>
					Looks like it runs <br />
					Here is a text box <br />
					<TextBox
						isEditable
						startsEditing={false}
						onChange={(value: string) => console.log(value)}
					/>
				</p>
			</div>
		</React.Fragment>);
	}
}

export default App;
