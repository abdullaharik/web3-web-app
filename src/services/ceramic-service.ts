import { ComposeClient } from "@composedb/client";
import {
	Indexes, IndexLink, Link, UserIndex, Users,
} from "types/entity";
import {
	getCurrentDateTime, isSSR, maskDID, setDates,
} from "utils/helper";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { RuntimeCompositeDefinition } from "@composedb/types";
import api, { GetUserIndexesRequestBody, UserIndexResponse } from "services/api-service";

import { DID } from "dids";

import { appConfig } from "config";
import { definition } from "../types/merged-runtime";

class CeramicService {
	private ipfs: IPFSHTTPClient = create({
		url: appConfig.ipfsInfura,
	});
	private client = new ComposeClient({
		ceramic: "https://composedb.index.network",
		definition: definition as RuntimeCompositeDefinition,
	});

	constructor(did?: DID) {
		this.client.setDID(did!);
	}

	async authenticateUser(did: any) {
		if (!isSSR()) {
			try {
				await this.client.setDID(did);
				return true;
			} catch (err) {
				return false;
			}
		} else {
			return false;
		}
	}

	isUserAuthenticated() {
		return !!(this.client?.did?.authenticated);
	}

	async createIndex(pkpPublicKey: string, content: Partial<Indexes>): Promise<Indexes> {
		setDates(content, true);
		if (!content.title) {
			content.title = "Untitled Index";
		}
		const cdt = getCurrentDateTime();
		content.createdAt = cdt;
		content.updatedAt = cdt;
		content.pkpPublicKey = pkpPublicKey;
		content.collabAction = appConfig.defaultCID;
		const payload = {
			content,
		};

		const { data, errors } = await this.client.executeQuery<{ createIndex: { document: Indexes } }>(`
			mutation CreateIndex($input: CreateIndexInput!) {
				createIndex(input: $input) {
					document {
						id
						title
						collabAction
						pkpPublicKey
						createdAt
						updatedAt
					}
				}
			}`, { input: payload });

		if (errors) {
			// TODO Handle
		}

		// TODO Before release.
		return data?.createIndex.document!;
	}
	async updateIndex(index: Partial<Indexes>, content: Partial<Indexes>): Promise<Indexes> {
		content.updatedAt = getCurrentDateTime();
		const payload = {
			id: index.id,
			content,
		};

		const { data, errors } = await this.client.executeQuery<{ updateIndex: { document: Indexes } }>(`
			mutation UpdateIndex($input: UpdateIndexInput!) {
				updateIndex(input: $input) {
					document {
						id
						title
						collabAction
						pkpPublicKey
						createdAt
						updatedAt
						deletedAt
					}
				}
			}`, { input: payload });
		if (errors) {
			// TODO Handle
		}
		return data?.updateIndex.document!;
	}

	async getLinkById(link_id: string) {
		const { data, errors } = await this.client.executeQuery(`{
			node(id:"${link_id}"){
			  id
			  ... on Link{
				id
				content
				title
				url
				favicon
				createdAt
				updatedAt
				deletedAt
				tags
			}}
		  }`);
		if (errors) {
			// TODO Handle
		}
		return <Link>(data?.node as any);
	}

	async createLink(link: Partial<Link>): Promise<Link> {
		setDates(link); // TODO Conditional updatedAt
		link.updatedAt = getCurrentDateTime();
		if (!link.tags) {
			link.tags = [];
		}
		const payload = {
			content: link,
		};
		const { data, errors } = await this.client.executeQuery<{ createLink: { document: Link } }>(`
			mutation CreateLink($input: CreateLinkInput!) {
				createLink(input: $input) {
					document {
						id
						controllerDID{
							id
						}
						url
						title
						tags
						favicon
						createdAt
						updatedAt
						deletedAt
					}
				}
			}`, { input: payload });

		if (errors) {
			// TODO Handle
		}
		return data?.createLink.document!;
	}
	async updateLink(link_id: string, link: Link): Promise <Link> {
		// Get index link

		link.updatedAt = getCurrentDateTime();
		const payload = {
			id: link_id,
			content: link,
		};
		const { data, errors } = await this.client.executeQuery<{ updateLink: { document: Link } }>(`
			mutation UpdateLink($input: UpdateLinkInput!) {
				updateLink(input: $input) {
					document {
						id
						url
						title
						tags
						favicon
						createdAt
						updatedAt
						deletedAt						
					}
				}
			}`, { input: payload });
		if (errors) {
			// TODO Handle
		}

		return data?.updateLink.document!;
	}

	async addIndexLink(index: Indexes, link_id: string) : Promise <IndexLink> {
		const indexLink: IndexLink = {
			indexId: index.id,
			linkId: link_id,
			updatedAt: getCurrentDateTime(),
			createdAt: getCurrentDateTime(),
			indexerDID: this.client.did?.parent!,
		};

		const payload = {
			content: indexLink,
		};

		if (!this.client.did?.authenticated) {
			// handle error
		}
		const { data, errors } = await this.client.executeQuery<{ createIndexLink: { document: IndexLink } }>(`
			mutation CreateIndexLink($input: CreateIndexLinkInput!) {
				createIndexLink(input: $input) {
					document {
						id
						indexerDID {
							id
						}
						controllerDID {
							id
						}
						indexId
						linkId
						createdAt
						updatedAt
						deletedAt
						link {
							id
							controllerDID {
								id
							}
							title
							url
							favicon
							tags
							content
							createdAt
							updatedAt
							deletedAt
						}
					}
				}
			}`, { input: payload });

		if (errors) {
			// TODO Handle
		}
		return data?.createIndexLink.document!;
	}
	async removeIndexLink(index_link: IndexLink): Promise <IndexLink | undefined> {
		const index = await api.getIndexById(index_link.indexId!);
		if (!index) {
			throw new Error("Index not found");
		}
		const payload = {
			id: index_link.id!,
			content: {
				deletedAt: getCurrentDateTime(),
			},
		};
		const { data, errors } = await this.client.executeQuery<{ updateIndexLink: { document: IndexLink } }>(`
			mutation UpdateIndexLink($input: UpdateIndexLinkInput!) {
				updateIndexLink(input: $input) {
					document {
						id
						indexId
						linkId
						createdAt
						updatedAt
						deletedAt				
					}
				}
			}`, { input: payload });

		if (errors) {
			// TODO Handle
		}

		return data?.updateIndexLink.document!;
	}
	async addTag(link_id: string, tag: string): Promise <Link | undefined> {
		const link = await this.getLinkById(link_id);
		if (link) {
			let { tags } = link;
			if (tags && tags.includes(tag)) {
				return link;
			}
			tags = [...(tags ? [...tags, tag] : [tag])];
			return await this.updateLink(link_id, {
				tags,
			});
		}
		// TODO handle.
	}
	async removeTag(link_id: string, tag: string): Promise <Link | undefined> {
		const link = await this.getLinkById(link_id);
		if (link) {
			let { tags } = link;
			if (!tags) {
				return link;
			}
			tags = tags.filter((t) => t !== tag);
			return await this.updateLink(link_id, {
				tags,
			});
		}
		// TODO handle.
	}
	async setLinkFavorite(streamId: string, linkId: string, favorite: boolean) {
		/*
		const oldDoc = await this.getIndexById(streamId);
		const newContent = { ...oldDoc.content };
		const link = newContent.links?.find((l) => l.id === linkId);
		if (link) {
			link.favorite = favorite;
			await oldDoc.update(newContent, undefined, {
				publish: true,
			});
			return oldDoc;
		}
		 */
	}
	async setUserIndex(indexId: string, type: string, status: boolean): Promise <UserIndex | undefined> {
		const userIndexes = await api.getUserIndexes({
			index_id: indexId,
			did: this.client.did?.parent!,
		} as GetUserIndexesRequestBody) as UserIndexResponse;

		const content: Partial<UserIndex> = {
			type,
			indexId,
			updatedAt: getCurrentDateTime(),
			createdAt: getCurrentDateTime(),
		};
		if (!status) {
			content.deletedAt = getCurrentDateTime();
		}
		type UserIndexKey = keyof typeof userIndexes;
		const userIndex: UserIndex | undefined = userIndexes[type as UserIndexKey];
		if (!userIndex) {
			return await this.createUserIndex(content);
		}
		return await this.updateUserIndex(userIndex.id!, content);
	}
	async createUserIndex(content: Partial<UserIndex>): Promise<UserIndex | undefined> {
		const { data, errors } = await this.client.executeQuery<{ createUserIndex: { document: UserIndex } }>(`
			mutation CreateUserIndex($input: CreateUserIndexInput!) {
				createUserIndex(input: $input) {
					document {
						id
						indexId
						controllerDID {
							id
						}
						createdAt
						updatedAt
						deletedAt
					}
				}
			}`, { input: { content } });
		if (errors) {
			// TODO Handle
		}
		return data?.createUserIndex.document!;
	}
	async updateUserIndex(indexId: string, content: Partial<UserIndex>): Promise<UserIndex | undefined> {
		const { data, errors } = await this.client.executeQuery<{ updateUserIndex: { document: UserIndex } }>(`
			mutation UpdateUserIndex($input: UpdateUserIndexInput!) {
				updateUserIndex(input: $input) {
					document {
						id
						indexId
						controllerDID {
							id
						}
						createdAt
						updatedAt
						deletedAt
					}
				}
			}`, { input: { content, id: indexId } });

		if (errors) {
			// TODO Handle
		}
		return data?.updateUserIndex.document!;
	}
	async getProfile(): Promise<Users> {
		const { data, errors } = await this.client.executeQuery<{ viewer: { profile: Users } }>(`
			query {
				viewer {
					profile {
						name
						bio
						avatar
					}
				}
			}
		`);
		if (errors) {
			// TODO Handle
		}
		if (data && this.client.did && !data.viewer.profile) {
			data.viewer.profile = {
				name: maskDID(this.client.did.id),
			};
		}
		return <Users>data?.viewer?.profile!;
	}
	async setProfile(profile: Users) {
		const payload = {
			content: profile,
		};
		const { data, errors } = await this.client.executeQuery<{ createProfile: { document: Users } }>(`	
			mutation CreateProfile($input: CreateProfileInput!) {
				createProfile(input: $input) {
					document {
					  name
					  bio
					  avatar					
					}
				}
			}`, { input: payload });
		if (errors) {
			console.log(errors);
			// TODO Handle
		}
		return data?.createProfile.document!;
	}
	async uploadImage(file: File) {
		try {
			const { cid, path } = await this.ipfs.add(file);
			return { cid, path };
		} catch (err) {
			//
		}
	}
}

export default CeramicService;
