import PageContainer from "components/layout/site/PageContainer";
import PageLayout from "components/layout/site/PageLayout";
import AskIndexes from "components/site/indexes/AskIndexes";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, {
	ReactElement, useEffect, useState,
} from "react";
import { NextPageWithLayout } from "types";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { useCeramic } from "hooks/useCeramic";
import { useApp } from "hooks/useApp";
import crypto from "crypto";

const IndexesPage: NextPageWithLayout = () => {
	const router = useRouter();

	const { did } = router.query;
	const [chatId, setChatId] = useState<string>(uuidv4());
	const ceramic = useCeramic();
	const {
		setViewedProfile,
	} = useApp();

	const getProfile = async (viewedDid: string) => {
		try {
			const profile = await ceramic.getProfileByDID(viewedDid);
			if (profile) {
				setViewedProfile(profile);
			}
		} catch (err) {
			// profile error
		}
	};
	useEffect(() => {
		did && getProfile(did.toString());
	}, [did]);
	useEffect(() => {
		const suffix = crypto.createHash("sha256").update(router.asPath).digest("hex");
		setChatId(`${localStorage.getItem("chatterID")}-${suffix}`);
	}, [router.asPath]);

	return <PageContainer key={chatId.toString()} page={"profile"}>
		<div>
			<AskIndexes id={chatId} did={did!.toString()} />
		</div>
	</PageContainer>;
};

IndexesPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<PageLayout
			hasFooter={false}
			headerType="user"
		>
			{page}
		</PageLayout>
	);
};

export async function getServerSideProps({ locale }: any) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "pages", "components"])),
		},
	};
}

export default IndexesPage;
