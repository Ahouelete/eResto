// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  expirationTime: 5000,
  //backend: 'https://backend-srh.impots.bj/api',
  // backend: 'http://172.20.10.2:8080/api',
  //backend: 'http://192.168.137.99:8080/api',
  backend: '127.0.0.1:8080/api',
  pusher: {
    key: '64bd30fd9bc82e487c69',
    clusters: {
      cluster: 'eu',
      encrypted: true,
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
