'use strict';

var replicate = require('./replicate');

/*
options = {
  grunt: grunt,
  commonConfig: commonConfig, //config.json
  key: key //SAUCE for multi-browser
}
 */

module.exports = function(options) {

  var replicatejs = replicate({
    baseDir: options.baseDir
  });

  function features() {
    replicatejs.features(process.env[options.key]);
  }

  function clean() {
    options.grunt.log.writeln('clean up feature files');
    replicatejs.clean();
  }

  function exit() {

    function fromTask(taskName) {
      return function() {
        options.grunt.task.requires(taskName);
      }
    }

    return {
      fromTask: fromTask
    }

  }

  return {
    features: features,
    clean: clean,
    exit: exit()
  }

};
