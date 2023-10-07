import {
	createContext, useState, useContext, useEffect,
} from "react";
import { appConfig } from "config";
import CreateModal from "components/site/modal/CreateModal";
import ConfirmTransaction from "components/site/modal/Common/ConfirmTransaction";
import LitService from "services/lit-service";
import CeramicService from "services/ceramic-service";
import {
	Indexes,
	Users,
	MultipleIndexListState,
	IndexListState,
} from "types/entity";
import { useCeramic } from "hooks/useCeramic";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

export interface AppContextValue {
	indexes: MultipleIndexListState
	setIndexes: (indexes: MultipleIndexListState) => void
	section: keyof MultipleIndexListState
	setSection: (section: keyof MultipleIndexListState) => void
	setCreateModalVisible: (visible: boolean) => void
	setTransactionApprovalWaiting: (visible: boolean) => void
	leftSidebarOpen: boolean
	setLeftSidebarOpen: (visible: boolean) => void
	rightSidebarOpen: boolean
	setRightSidebarOpen: (visible: boolean) => void
	viewedProfile: Users | undefined
	setViewedProfile: (profile: Users | undefined) => void
}

export const AppContext = createContext({} as AppContextValue);

export const AppContextProvider = ({ children } : any) => {
	const [indexes, setIndexes] = useState<MultipleIndexListState>({
		all_indexes: {
			skip: 0,
			totalCount: 0,
			hasMore: true,
			indexes: [] as Indexes[],
		} as IndexListState,
		my_indexes: {
			skip: 0,
			totalCount: 0,
			hasMore: true,
			indexes: [] as Indexes[],
		} as IndexListState,
		starred: {
			skip: 0,
			totalCount: 0,
			hasMore: true,
			indexes: [] as Indexes[],
		} as IndexListState,
	});
	const searchParams = useSearchParams();
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const [transactionApprovalWaiting, setTransactionApprovalWaiting] = useState(false);
	const [viewedProfile, setViewedProfile] = useState<Users>();
	const [section, setSection] = useState((searchParams.get("section") || "all_indexes") as keyof MultipleIndexListState);
	const router = useRouter();
	const ceramic = useCeramic();
	const { did, indexId } = router.query;
	const handleCreate = async (title: string) => {
		if (title) {
			// handleToggleCreateModal();
			setCreateModalVisible(false);
			setTransactionApprovalWaiting(true);
			const { pkpPublicKey } = await LitService.mintPkp();
			const sessionResponse = await LitService.getPKPSession(pkpPublicKey, appConfig.defaultCID);
			const c = new CeramicService();
			c.authenticateUser(sessionResponse.session.did);
			const doc = await c.createIndex(pkpPublicKey, { title } as Indexes);
			await ceramic.addUserIndex(doc.id, "my_indexes");
			if (doc != null) {
				setTransactionApprovalWaiting(false);
				await router.push(`/[did]/[indexId]`, `/${did}/${doc.id}`, { shallow: true });
			}
		}
	};

	const handleTransactionCancel = () => {
		setTransactionApprovalWaiting(false);
	};

	useEffect(() => {
		 section && viewedProfile && router.replace(`/[did]`, section === "all_indexes" ? `/${did || viewedProfile.id}` : `/${did || viewedProfile.id}?section=${section}`, { shallow: true });
	}, [section]);
	return (
		<AppContext.Provider value={{
			indexes,
			setIndexes,
			section,
			setSection,
			setCreateModalVisible,
			setTransactionApprovalWaiting,
			leftSidebarOpen,
			setLeftSidebarOpen,
			rightSidebarOpen,
			setRightSidebarOpen,
			viewedProfile,
			setViewedProfile,
		}}>
			{children}
			{/* eslint-disable-next-line max-len */}
			{transactionApprovalWaiting ? <ConfirmTransaction handleCancel={handleTransactionCancel} visible={transactionApprovalWaiting}></ConfirmTransaction> : <></>}
			{/* eslint-disable-next-line max-len */}
			{createModalVisible ? <CreateModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} onCreate={handleCreate}></CreateModal> : <></>}
		</AppContext.Provider>
	);
};

// Custom hook to use the Boolean context
export const useApp = () => {
	const contextValue = useContext(AppContext);
	if (contextValue === undefined) {
		throw new Error("useAppContext must be used within a AppContextProvider");
	}
	return contextValue;
};
