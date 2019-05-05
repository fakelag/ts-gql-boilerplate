import React from 'react';

interface ITextBoxStateProps {}
interface ITextBoxActions {}

interface ITextBoxState {
	inputElement: React.RefObject<HTMLInputElement>;
	isEditing: boolean;
}

interface ITextBoxProps extends ITextBoxStateProps, ITextBoxActions {
	isEditable: boolean;
	startsEditing: boolean;
	disabled?: boolean;
	placeHolder?: string;
	width?: number;
	style?: object;
	value?: string;
	icon?: any;
	defaultValue?: string;
	onChange(value: string): void;
}

class TextBox extends React.Component<ITextBoxProps, ITextBoxState> {
	public state: ITextBoxState = {
		inputElement: React.createRef(),
		isEditing: false,
	};

	constructor(props: ITextBoxProps) {
		super(props);

		this.state.isEditing = props.startsEditing;
	}

	public componentWillReceiveProps(nextProps: ITextBoxProps) {
		this.state.isEditing = nextProps.startsEditing;
	}

	public focusInput = (e: any): void => {
		e.stopPropagation();
		e.preventDefault();

		if (this.state.isEditing && this.state.inputElement.current)
			this.state.inputElement.current.focus();
	}

	public render() {
		const { onChange, isEditable, style, width, disabled } = this.props;
		const { isEditing, inputElement } = this.state;

		let disableStyle = {};

		if (disabled) {
			disableStyle = {
				backgroundColor: '#f0f4f8',
				color: '#bcccdc',
			};
		}

		return (<div
				className="TextField"
				is-focused={(!disabled && isEditing) ? 1 : 0}
				style={{
					width: width ? `${width - (0.6875 * 2.0) - 0.125}rem` : undefined,
					...disableStyle,
					...style,
				}}
				key={this.props.defaultValue}
				onFocus={this.focusInput}
				onClick={this.focusInput}
				onMouseDown={this.focusInput}
				onMouseUp={this.focusInput}
			>
			<input
				placeholder={this.props.placeHolder}
				disabled={disabled}
				ref={inputElement}
				style={{ ...disableStyle }}
				type="textbox"
				className="TextFieldInput"
				value={this.props.value}
				defaultValue={this.props.defaultValue}
				onChange={(e: any) => onChange(e.target.value)}
				// readOnly={!isEditing}
				onBlur={() => this.setState({ isEditing: false })}
				onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
					if (e.key === 'Enter')
						this.setState({ isEditing: false });
				}}
				onFocus={(e: any) => this.setState({ isEditing: true })}
				onClick={(e: any) => e.stopPropagation()}
				onMouseDown={(e: any) => e.stopPropagation()}
				onMouseUp={(e: any) => e.stopPropagation()}
			/>
			{this.props.icon && <img
				src={this.props.icon}
				style={{
					display: 'inline-block',
					width: '1rem',
					height: '1rem',
					cursor: isEditing || disabled ? undefined : 'pointer',
					color: isEditing || disabled ? '#666' : '#000',
				}}
				onClick={() => {
					if (!isEditing && isEditable && !disabled) {
						this.setState({ isEditing: true });

						if (inputElement.current)
							inputElement.current.focus();
					}
				}}
			/>}
		</div>);
	}
}


export default TextBox;
