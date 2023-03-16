// This is an auto-generated file, do not edit manually
export const definition = {
	models: {
		Index: { id: "kjzl6hvfrbw6c90qlqsw8wknzoi3rhspund6qzgz8vifalod8jk8ujwdji5kdm1", accountRelation: { type: "list" } }, Link: { id: "kjzl6hvfrbw6casje7g29aekjral6tocm9tbzyc7n3dwtp4j1il3sd3l5k6q7x4", accountRelation: { type: "list" } }, UserIndex: { id: "kjzl6hvfrbw6cb2dygt8kwbw3jfcgny4omo1patq3iipe2o24jcwl5v99by7qye", accountRelation: { type: "list" } }, IndexasProfile: { id: "kjzl6hvfrbw6cajco6mzjpzioqyc2rb7tyge22a19c0eyzgrch9xkzsqc3tikqp", accountRelation: { type: "single" } },
	},
	objects: {
		Index: {
			title: { type: "string", required: true }, created_at: { type: "datetime", required: true }, deleted_at: { type: "datetime", required: false }, updated_at: { type: "datetime", required: true }, collab_action: { type: "string", required: false }, owner: { type: "view", viewType: "documentAccount" }, version: { type: "view", viewType: "documentVersion" }, links: { type: "view", viewType: "relation", relation: { source: "queryConnection", model: "kjzl6hvfrbw6casje7g29aekjral6tocm9tbzyc7n3dwtp4j1il3sd3l5k6q7x4", property: "index_id" } }, links_count: { type: "view", viewType: "relation", relation: { source: "queryCount", model: "kjzl6hvfrbw6casje7g29aekjral6tocm9tbzyc7n3dwtp4j1il3sd3l5k6q7x4", property: "index_id" } },
		},
		Link: {
			url: { type: "string", required: true }, tags: { type: "list", required: false, item: { type: "string", required: false } }, title: { type: "string", required: false }, content: { type: "string", required: false }, favicon: { type: "string", required: false }, index_id: { type: "streamid", required: true }, created_at: { type: "datetime", required: true }, deleted_at: { type: "datetime", required: false }, updated_at: { type: "datetime", required: true }, indexer_did: { type: "did", required: true }, index: { type: "view", viewType: "relation", relation: { source: "document", model: "kjzl6hvfrbw6c90qlqsw8wknzoi3rhspund6qzgz8vifalod8jk8ujwdji5kdm1", property: "index_id" } }, owner: { type: "view", viewType: "documentAccount" }, version: { type: "view", viewType: "documentVersion" },
		},
		UserIndex: {
			type: { type: "string", required: false }, index_id: { type: "streamid", required: true }, created_at: { type: "datetime", required: true }, deleted_at: { type: "datetime", required: false }, index: { type: "view", viewType: "relation", relation: { source: "document", model: "kjzl6hvfrbw6c90qlqsw8wknzoi3rhspund6qzgz8vifalod8jk8ujwdji5kdm1", property: "index_id" } }, owner: { type: "view", viewType: "documentAccount" }, version: { type: "view", viewType: "documentVersion" },
		},
		IndexasProfile: { pfp: { type: "string", required: false }, name: { type: "string", required: false }, description: { type: "string", required: false } },
	},
	enums: {},
	accountData: {
		indexList: { type: "connection", name: "Index" }, linkList: { type: "connection", name: "Link" }, userIndexList: { type: "connection", name: "UserIndex" }, indexasProfile: { type: "node", name: "IndexasProfile" },
	},
};
