import cc from "classcat";
import IconGoogle from "components/base/Icon/IconGoogle";
import IconTwitter from "components/base/Icon/IconTwitter";
import Flex from "components/layout/base/Grid/Flex";
import React from "react";
import {
	ButtonThemeType,
	InputSizeType,
} from "types";

export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	customType?: "google" | "twitter";
	theme?: ButtonThemeType;
	size?: InputSizeType;
	block?: boolean;
	outlined?: boolean;
	addOnBefore?: React.ReactNode;
	addOnAfter?: React.ReactNode;
	iconButton?: boolean;
	group?: boolean;
	borderless?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	customType,
	children,
	className,
	borderless,
	group,
	block,
	iconButton,
	outlined,
	addOnBefore,
	addOnAfter,
	theme = "primary",
	size = "md",
	...props
}) => {
	switch (customType) {
		case "google":
			return <button {...props} className={cc(
				[
					"idx-button",
					`idx-button-${theme}`,
					`idx-button-${size}`,
					block && !group ? "idx-button-block" : "",
					group ? "idx-button-group-item" : "",
					iconButton ? `idx-button-icon idx-button-icon-${size}` : "",
					borderless ? "idx-button-borderless" : "",
					className,
				],
			)}>
				<IconGoogle width={20} />
				{children}
			</button>;
		case "twitter":
			return <button {...props} className={cc(
				[
					"idx-button",
					outlined ? `idx-button-${theme}-outlined` : `idx-button-${theme}`,
					block ? "idx-button-block" : "",
					iconButton ? `idx-button-icon idx-button-icon-${size}` : "",
					borderless ? "idx-button-borderless" : "",
					className,
				],
			)}>
				<IconTwitter height={20} fill="var(--twitter-blue)" />
				{children}
			</button>;
		default:
			return <button
				{...props}
				className={cc(
					[
						"idx-button",
						`idx-button-${theme}`,
						`idx-button-${size}`,
						block ? "idx-button-block" : "",
						addOnBefore ? "idx-button-addon-b" : "",
						addOnAfter ? "idx-button-addon-a" : "",
						iconButton ? `idx-button-icon idx-button-icon-${size}` : "",
						borderless ? "idx-button-borderless" : "",
						className,
					],
				)}>
				{addOnAfter || addOnBefore ? <Flex className="idx-button-inner" inline alignItems="center">{children}</Flex> : children}
			</button>;
	}
};

export default Button;
