## cucumber-replicate
  Run Cucumber scenarios Parallel on Multiple browsers. Replicates the feature files based on the Browsers user wants to run
  

### The Use

#### Are you looking to run your Cucumber Scenarios on Multiple Browsers, and all in Parallel? Then you are looking at the right place.

This module replicates the Cucumber Feature files based on requested Browsers to run; i.e. you can request BROWSER=firefox,chrome,safari. Then, this module uses [cucumber-parallel][1] module to run them in parallel mode. Your Selenium WebDriver configuration will decide which browser to launch for which scenarios. Please read further how to setup your in your existing framework.


[1]: https://www.npmjs.com/package/cucumber-parallel "cucumber-parallel"