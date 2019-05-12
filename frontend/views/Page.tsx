import React from 'react';
import { Link } from 'react-router-dom';

interface IPageProps {}

const Page = (props: IPageProps) => {
	return (<div className="Page">
		<ul>
			<li>
				<Link to="/login">Login</Link>
			</li>
			<li>
				<a href="/logout">Log Out</a>
			</li>
		</ul>
	</div>);
};

export default Page;
