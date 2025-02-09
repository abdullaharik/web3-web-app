import Dropdown from "components/base/Dropdown";
import Text from "components/base/Text";
import DropdownMenuItem from "components/base/Dropdown/DropdownMenuItem";
import Flex from "components/layout/base/Grid/Flex";
import React from "react";
import IconContextMenu from "components/base/Icon/IconContextMenu";
import IconCopy from "components/base/Icon/IconCopy";
import { copyToClipboard } from "utils/helper";
import IconRemove from "components/base/Icon/IconRemove";
import IconAddCircle from "components/base/Icon/IconAddCircle";
import { Indexes } from "types/entity";

export interface IndexOperationsPopupProps {
	index: Indexes;
	isOwner?: boolean;
	userIndexToggle(index: Indexes, type: string, op: string): void;
}

const IndexOperationsPopup: React.VFC<IndexOperationsPopupProps> = ({
	index,
	isOwner = false,
	userIndexToggle,
}) => (
	<Dropdown
		menuClass="index-list-item-menu ml-6"
		position="bottom-right"
		menuItems={
			<>
				<DropdownMenuItem onClick={() => {
					copyToClipboard(`${window.location.href}`);
				}}>
					<Flex alignItems="center">
						<IconCopy />
						<Text className="ml-3" element="span" size="md" >Copy Link</Text>
					</Flex>
				</DropdownMenuItem>
				{
					isOwner && (
						index && index.isOwner ? (
							<>
								<DropdownMenuItem divider />
								<DropdownMenuItem
									onClick={() => userIndexToggle(index, "owner", "remove")}
								>
									<Flex alignItems="center">
										<IconRemove />
										<Text className="ml-3" theme="error" element="span" size="md" >Remove</Text>
									</Flex>
								</DropdownMenuItem>
							</>
						) : (
							<>
								<DropdownMenuItem divider />
								<DropdownMenuItem
									onClick={() => userIndexToggle(index, "owner", "add")}
								>
									<Flex alignItems="center">
										<IconAddCircle />
										<Text className="ml-3" element="span" size="md" >Add to my indexes</Text>
									</Flex>
								</DropdownMenuItem>
							</>
						)
					)
				}
			</>
		}
	>
		<IconContextMenu width={20} height={20} className="index-list-item-menu-btn" />
	</Dropdown>
);

export default IndexOperationsPopup;
