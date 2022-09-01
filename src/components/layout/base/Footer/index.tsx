import React from "react";
import cc from "classcat";
import Header from "components/base/Header";
import Text from "components/base/Text";
import Container from "../Grid/Container";
import Col from "../Grid/Col";
import FlexRow from "../Grid/FlexRow";
import Flex from "../Grid/Flex";

export interface FooterProps extends
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	logoSize?: "full" | "mini";
	sticky?: boolean;
	bordered?: boolean;
	bgColor?: string;
}

export interface FooterMenuProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	placement?: "left" | "right" | "center";
}

const Footer: React.FC<FooterProps> = ({
	children,
	logoSize = "full",
	bgColor,
	bordered = false,
	style,
	sticky,
	...menuProps
}) => (
	<div
		className={cc([
			"py-lg-8",
			"py-sm-6",
			"footer-container",
			sticky ? "footer-sticky" : "",
			bordered ? "footer-bordered" : "",
		])}
		style={bgColor ? {
			...style,
			backgroundColor: bgColor,
		} : style}
		{...menuProps}
	>
		<Container
			className="footer"
		>
			<FlexRow
				fullHeight
				align="center"
				wrap={false}
			>
				<Col>
					<Flex
						flexDirection="column"
					>
						<Header className="footer-title" theme="white">Keep up with us</Header>
						<Text
							className="mt-3"
							style={{
								color: "var(--gray-2)",
							}}>Join our community to get support, provide feedback, or just to say hello on...</Text>
						{children}
					</Flex>
				</Col>
			</FlexRow>
		</Container>
	</div>
);

export const FooterMenu: React.FC<FooterMenuProps> = ({
	className, children, placement = "left", ...props
}) => <div {...props} className={cc(["footer-menu", `navbar-menu-${placement}`, className || ""])}>{children}</div>;

export default Footer;
