export const environment = {
	neo4j: {
		url: (location: any) => {
			if(location.hostname === 'localhost') return "neo4j://localhost";
			else return `neo4j://neo4j.${location.hostname}:7687`
		},
		username: 'readonly',
		password: 'well-known',
	},
	production: true,
};
