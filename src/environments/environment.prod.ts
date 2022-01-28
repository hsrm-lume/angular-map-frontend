export const environment = {
	neo4j: {
		url: (location: any) => `neo4j://${location.hostname}:7687`,
		username: 'readonly',
		password: 'well-known',
	},
	startDate: new Date('2021-01-01').getTime(),
	tileServerUrl: 'https://lume.cs.hs-rm.de:3001',
	appDownloadUrlAndroid:
		'https://github.com/hsrm-lume/react-native-cli-lume/releases/latest/download/app-release.apk',
	appDownloadUrlIos: 'https://testflight.apple.com/join/itow08sk',
	production: true,
};
