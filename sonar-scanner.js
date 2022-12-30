const scanner = require('sonarqube-scanner');

scanner(
  {
    serverUrl : 'http://localhost:9000',
    token : "",
    options: {
      'sonar.projectName': 'angular-d3-cloud',
      'sonar.projectKey': 'angular-d3-cloud',
      'sonar.projectDescription': 'D3 Cloud component for Angular built upon d3-cloud',
      'sonar.javascript.globals': 'angular,d3',
      'sonar.javascript.ignoreHeaderComments': 'true',
      'sonar.javascript.environments': 'browser',
      'sonar.typescript.file.suffixes': '.ts',
      'sonar.sources': './projects/angular-d3-cloud/src/lib',
      'sonar.exclusions': '.angular,.github,.jest-cache,coverage,.git,.scannerwork,dist,node_modules,**/*.spec.ts',
      'sonar.test.exclusions': '**/*.spec.ts',
      'sonar.coverage.exclusions': '**/*.spec.ts',
      'sonar.javascript.lcov.reportPaths': './coverage/lcov.info',
      'sonar.scm.disabled': 'true'
    }
  },
  () => process.exit()
);