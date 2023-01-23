import { DIDSession } from "did-session";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";

import { useAppDispatch, useAppSelector } from "hooks/store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ceramicService from "services/ceramic-service";
import {
	disconnectApp, selectConnection, setAuthLoading, setCeramicConnected, setMetaMaskConnected,
} from "store/slices/connectionSlice";

declare global {
	interface Window {
		ethereum: any;
	}
}

export interface AuthHandlerContextType {
	connect(provider: any): Promise<void>;
	disconnect(): void;
}

let session: DIDSession | null | undefined;

export const AuthHandlerContext = React.createContext<AuthHandlerContextType>({} as any);

export const AuthHandlerProvider: React.FC = ({ children }) => {
	const connection = useAppSelector(selectConnection);
	const dispatch = useAppDispatch();
	const router = useRouter();

	const disconnect = async () => {
		localStorage.removeItem("provider");
		localStorage.removeItem("did");
		await ceramicService.close();
		session = null;
		dispatch(disconnectApp());

		router.push("/");
	};
	const connectMetamask = async (initProvider?: any) => {
		// Metamask Login
		dispatch(setAuthLoading(true));

		if (!connection.metaMaskConnected) {
			const sessionStr = localStorage.getItem("did"); // for production, you will want a better place than localStorage for your sessions.
			if (sessionStr) {
				session = await DIDSession.fromSession(sessionStr);
			}

			if (!session || (session.hasSession && session.isExpired)) {
				if (window.ethereum === null || window.ethereum === undefined) {
					throw new Error("No injected Ethereum provider found.");
				}
				// We enable the ethereum provider to get the user's addresses.
				const ethProvider = window.ethereum;
				// request ethereum accounts.
				const addresses = await ethProvider.enable({
					method: "eth_requestAccounts",
				});
				const accountId = await getAccountId(ethProvider, addresses[0]);
				const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId);

				session = await DIDSession.authorize(authMethod, { resources: ["ceramic://*"] });

				localStorage.setItem("did", session.serialize());
			}

			dispatch(setAuthLoading(false));
		}
	};

	const authToCeramic = async () => {
		if (!ceramicService.isAuthenticated()) {
			const result = await ceramicService.authenticate(session?.did);
			dispatch(setCeramicConnected(result));
			// await ceramicService.syncContents();
		} else {
			dispatch(setCeramicConnected(true));
		}
	};

	const completeConnections = async () => {
		await authToCeramic();
	};

	// App Loads
	useEffect(() => {
		if (session && (session.hasSession && !session.isExpired)) {
			dispatch(setMetaMaskConnected({
				metaMaskConnected: true,
				did: session.did.id,
			}));
		} else {

			dispatch(setMetaMaskConnected({
				metaMaskConnected: false,
			}));
		}
	}, [session]);

	useEffect(() => {
		if (connection.metaMaskConnected) {
			completeConnections();
		}
	}, [connection.metaMaskConnected]);

	return <AuthHandlerContext.Provider value={{
		connect: connectMetamask,
		disconnect,
	}}>{children}</AuthHandlerContext.Provider>;
};
