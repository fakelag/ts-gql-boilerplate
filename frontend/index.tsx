import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { client } from './link';

import Root from './views/Root';

import './index.scss';

ReactDOM.render(<ApolloProvider client={client}>
	<Root />
</ApolloProvider>, document.getElementById('root'));
