export interface IUserData {
	name: string;
}

export interface ILoginData {
	token: string;
	user: IUserData;
}
