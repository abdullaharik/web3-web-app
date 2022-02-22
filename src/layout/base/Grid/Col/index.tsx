import React from "react";
import cc from "classcat";
import { GridFractionType } from "types";

export interface ColProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	xs?: GridFractionType;
	sm?: GridFractionType;
	md?: GridFractionType;
	lg?: GridFractionType;
	auto?: boolean;
	xsPull?: GridFractionType;
	smPull?: GridFractionType;
	mdPull?: GridFractionType;
	lgPull?: GridFractionType;
	xsPush?: GridFractionType;
	smPush?: GridFractionType;
	mdPush?: GridFractionType;
	lgPush?: GridFractionType;
	xsOffset?: GridFractionType;
	smOffset?: GridFractionType;
	mdOffset?: GridFractionType;
	lgOffset?: GridFractionType;
	pullRight?: boolean;
	pullLeft?: boolean;
	centerBlock?: boolean;
	clearfix?: boolean;
	show?: boolean;
	hidden?: boolean;
	invisible?: boolean;
	textHide?: boolean;
	fullHeight?: boolean;
	fullWidth?: boolean;
	noGutters?: boolean;
	noXGutters?: boolean;
	noYGutters?: boolean;
}

const Col: React.FC<ColProps> = ({
	children,
	className,
	xs,
	sm,
	md,
	lg,
	auto = true,
	xsPull,
	smPull,
	mdPull,
	lgPull,
	xsPush,
	smPush,
	mdPush,
	lgPush,
	xsOffset,
	smOffset,
	mdOffset,
	lgOffset,
	pullRight,
	pullLeft,
	centerBlock,
	clearfix,
	show,
	hidden,
	invisible,
	textHide,
	fullHeight = false,
	fullWidth = false,
	noGutters = false,
	noXGutters = false,
	noYGutters = false,
	...divProps
}) => (
	<div
		className={cc([
			"idx-col",
			(!xs && !sm && !md && !lg) && auto ? "idx-col-auto" : "",
			xs ? `col-xs-${xs}` : "",
			sm ? `col-sm-${sm}` : "",
			md ? `col-md-${md}` : "",
			lg ? `col-lg-${lg}` : "",
			xsPull ? `col-xs-pull-${xsPull}` : "",
			smPull ? `col-sm-pull-${smPull}` : "",
			mdPull ? `col-md-pull-${mdPull}` : "",
			lgPull ? `col-lg-pull-${lgPull}` : "",
			xsPush ? `col-xs-push-${xsPush}` : "",
			smPush ? `col-sm-push-${smPush}` : "",
			mdPush ? `col-md-push-${mdPush}` : "",
			lgPush ? `col-lg-push-${lgPush}` : "",
			xsOffset ? `col-xs-offset-${xsOffset}` : "",
			smOffset ? `col-sm-offset-${smOffset}` : "",
			mdOffset ? `col-md-offset-${mdOffset}` : "",
			lgOffset ? `col-lg-offset-${lgOffset}` : "",
			pullRight ? "pull-right" : "",
			pullLeft ? "pull-left" : "",
			centerBlock ? "center-block" : "",
			clearfix ? "clearfix" : "",
			show ? "show" : "",
			hidden ? "hidden" : "",
			invisible ? "invisible" : "",
			textHide ? "textHide" : "",
			fullHeight ? "idx-h-100" : "",
			fullWidth ? "idx-w-100" : "",
			noGutters ? "idx-col-no-gutters" : "",
			noXGutters ? "idx-col-no-x-gutters" : "",
			noYGutters ? "idx-col-no-y-gutters" : "",
			className || ""])}
		{...divProps}
	>
		{children}
	</div>);

export default Col;
