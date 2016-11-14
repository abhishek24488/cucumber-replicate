## cucumber-replicate
  Run Cucumber scenarios Parallel on Multiple browsers. Replicates the feature files based on the Browsers user wants to run
  

#### Are you looking to run your Cucumber Scenarios on Multiple Browsers, and all in Parallel? You'r at the right place.

1. cucumber-replicate automatically replicates the Cucumber Feature files based on requested Browsers to run; i.e. you can request BROWSER=firefox,chrome,safari 
2. You can use [cucumber-parallel][1] module to run them in parallel mode - Features/Scenarios in Parallel
3. Your Selenium WebDriver configuration will decide which browser to launch at the run time. Please read further how to setup your in your existing framework.


#### Setup

1. Install 

```
   
   npm i cucumber-replicate --save-dev
   
```

2. It's a grunt task. You'd need to add below tasks to your grunt

##### Gruntfile.js

```
var replicateTask = require('cucumber-replicate').task;

module.exports = function(grunt) {

    ...
    ...
    ...
    
    var replicate = replicateTask({
        baseDir: commonConfig.baseDir,
        grunt: grunt,
        key: 'SAUCE' //to run tests on SauceLabs
    });

    grunt.loadNpmTasks('grunt-force-task');

    // replicate features for the parallel run
    grunt.registerTask('replicate', replicate.features);

    // clean up replicated features
    grunt.registerTask('clean', replicate.clean);

    // exit from your cucumberjs task, e.g. taskk is cucumberjs:acceptance
    grunt.registerTask('exit', replicate.exit.fromTask('cucumberjs:acceptance'));

    // Acceptance - create your Final Task. Run your suite with grunt acceptance
    grunt.registerTask('acceptance', ['clean', 'replicate', 'force:cucumberjs',
        'force:clean', 'exit']);
};

```

3. Map the replicated feature files to your Browser setup as shown below

##### world.js

```
var replicate = require('cucumber-replicate').replicate;

function World() {

    var world = this;

    function setupTestBed(resolve, reject) {

        var options = {
            replicate: {
                baseDir: commonConfig.baseDir
            },
            map: {
                key: 'BROWSER', // this can be anything, i.e. SAUCE_BROWSER
                featurePath: world.scenario.getUri()
            }
        };

     
        function launchBrowser() {
            // your code to launch browser
            // Read process.env key as BROWSER to launch the respected browser
        }

        return replicate(options.replicate)
            .map(options.map) // maps the replicated folder structures to requested browser & sets the process.env variable, BROWSER in this case
            .then(launchBrowser)
            .catch(reject);
    }

    return new Promise(setupTestBed);
}

module.exports = function() {
    this.World = World;
};

```

[1]: https://www.npmjs.com/package/cucumber-parallel "cucumber-parallel"