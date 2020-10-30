// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyA2WpajE59SpO60Y6qhZX0vzxUJ0A_GgO0",
    authDomain: "farmacia-de-turno-rm.firebaseapp.com",
    databaseURL: "https://farmacia-de-turno-rm.firebaseio.com",
    projectId: "farmacia-de-turno-rm",
    storageBucket: "farmacia-de-turno-rm.appspot.com",
    messagingSenderId: "517638940536",
    appId: "1:517638940536:web:c1e61899e47f69dd428a8d"
  },
  basePath: 'https://farmacias-en-turno-api.herokuapp.com/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
