/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',
      testing: 'testing',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',
      '@angular/material': 'npm:@angular/material/material.umd.js',

      // other libraries
      'rxjs':                      'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'underscore':                'npm:underscore',
      'moment':                    'npm:moment',
      'redux':                     'npm:redux/dist/redux.js',
      'reselect':                  'npm:reselect/dist/reselect.js',
      'angular2-jwt':			   'npm:angular2-jwt/angular2-jwt.js',
      'jquery':			   		   'npm:jquery/dist/jquery.min.js',
      'bootstrap':			   	   'npm:bootstrap/dist/js/bootstrap.min.js',

      // barrels
      'reducers':				   'app/reducers',
      'actions':				   'app/actions',
      'redux_barrel':			   'app/redux_barrel',
      
      // css loader and node_modules bootstrap css
      'css':					   'node_modules/systemjs-plugin-css/css.js',
      'bootstrapcss':			   'npm:bootstrap/dist/css/bootstrap.min.css'
    },

    meta: {
        '*.css': { loader: 'css' }
    },

    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      testing: {
          defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      underscore: {
          main: 'underscore.js',
          defaultExtension: 'js'
      },
      moment: {
          main: 'moment.js',
          defaultExtension: 'js'
      },
      redux: {
          defaultExtension: 'js'
      },
      reselect: {
          defaultExtension: 'js'
      },
      reducers: { main: 'index.js', defaultExtension: 'js' },
      actions:  { main: 'index.js', defaultExtension: 'js' },
      redux_barrel: { main: 'index.js', defaultExtension: 'js' }
    }
  });

})(this);
