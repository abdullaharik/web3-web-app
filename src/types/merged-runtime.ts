// This is an auto-generated file, do not edit manually
export const definition = {"models":{"Index":{"id":"kjzl6hvfrbw6c9nr6lquycvocpcpg7sxz55v67iyyv2n2t29tre8hy2gli4m6wn","accountRelation":{"type":"list"}},"Link":{"id":"kjzl6hvfrbw6c8olbhuzwqimo7mudyf6iui6wb1nlymjf57y16uufzogjd0cc5m","accountRelation":{"type":"list"}},"UserIndex":{"id":"kjzl6hvfrbw6c7kkhq5pv4paxbwx5ss9il25cee1j0cpml1zj63g3v6q3uq5gx4","accountRelation":{"type":"list"}}},"objects":{"Index":{"title":{"type":"string","required":true},"created_at":{"type":"datetime","required":true},"updated_at":{"type":"datetime","required":true},"collab_action":{"type":"string","required":false},"owner":{"type":"view","viewType":"documentAccount"},"version":{"type":"view","viewType":"documentVersion"},"links":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c8olbhuzwqimo7mudyf6iui6wb1nlymjf57y16uufzogjd0cc5m","property":"indexID"}},"links_count":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c8olbhuzwqimo7mudyf6iui6wb1nlymjf57y16uufzogjd0cc5m","property":"indexID"}}},"Link":{"url":{"type":"string","required":true},"tags":{"type":"list","required":false,"item":{"type":"string","required":false}},"title":{"type":"string","required":false},"content":{"type":"string","required":false},"favicon":{"type":"string","required":false},"index_id":{"type":"streamid","required":true},"created_at":{"type":"datetime","required":true},"updated_at":{"type":"datetime","required":true},"indexer_did":{"type":"did","required":true},"index":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c9nr6lquycvocpcpg7sxz55v67iyyv2n2t29tre8hy2gli4m6wn","property":"index_id"}},"owner":{"type":"view","viewType":"documentAccount"},"version":{"type":"view","viewType":"documentVersion"}},"UserIndex":{"index_id":{"type":"streamid","required":true},"index":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c9nr6lquycvocpcpg7sxz55v67iyyv2n2t29tre8hy2gli4m6wn","property":"index_id"}},"version":{"type":"view","viewType":"documentVersion"}}},"enums":{},"accountData":{"indexList":{"type":"connection","name":"Index"},"linkList":{"type":"connection","name":"Link"},"userIndexList":{"type":"connection","name":"UserIndex"}}}