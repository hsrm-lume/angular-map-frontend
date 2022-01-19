// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	neo4j: {
		url: (_location: any) => 'neo4j://localhost:7687', // location is always localhost in dev-env
		username: 'neo4j',
		password: 's3cr3t4',
	},
	startDate: new Date('2021-01-01').getTime(),
	tileServerUrl: 'https://lume.cs.hs-rm.de:3001',
	appDownloadUrl:
		'https://github.com/hsrm-lume/react-native-cli-lume/releases/latest/download/app-release.apk',
	production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
