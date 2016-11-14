'use strict';

var log = require('debug')('automation-utils: replicateFeatures');
var Keys = require('../lib/keys');
var path = require('path');
var fsExtra = require('fs-extra');
var fs = require('fs');
var _ = require('lodash');
var Promise = require('bluebird');

module.exports = function(options) {

    var baseDirectory;

    if(options.commonConfig) {
        baseDirectory = options.commonConfig.baseDir;
    } else {
        baseDirectory = path.join(process.cwd(), options.baseDir);
    }

    var featuresDirectory = options.featuresDir
        ? path.join(baseDirectory, options.featuresDir)
        : path.join(baseDirectory, Keys.FEATURES_DIR_NAME);

    var backupFeaturesDirectory = path.join(baseDirectory, Keys.BACKUP_FEATURES_DIR_NAME);

    function _backupFeatures() {
        try {
            log('ensuring backup directory %s', backupFeaturesDirectory);
            fsExtra.ensureDirSync(backupFeaturesDirectory);
            log('copying to backup directory %s', backupFeaturesDirectory);
            fsExtra.copySync(featuresDirectory, backupFeaturesDirectory);
            log('empty features directory %s', featuresDirectory);
            fsExtra.emptyDirSync(featuresDirectory);
        } catch (err) {
            throw new Error('error in _backupFeatures()', err);
        }
    }

    function _createDirectory(directory) {
        var currentDirectory = path.join(featuresDirectory, directory);
        fsExtra.ensureDirSync(currentDirectory);
        fsExtra.copySync(backupFeaturesDirectory, currentDirectory);
    }

    function features(directories) {
        if (directories) {
            var listOfDirectories = directories.split(',');

            if (listOfDirectories.length > 1) {
                _backupFeatures();
                _.map(listOfDirectories, _createDirectory);
            }
        }
    }

    function clean() {
        if (fs.existsSync(backupFeaturesDirectory)) {
            try {
                log('empty features directory %s', featuresDirectory);
                fsExtra.emptyDirSync(featuresDirectory);
                fsExtra.ensureDirSync(featuresDirectory);
                log('undo features directory %s', featuresDirectory);
                fsExtra.copySync(backupFeaturesDirectory, featuresDirectory);
                fsExtra.removeSync(backupFeaturesDirectory);
            } catch (err) {
                throw new Error(err);
            }
        }
    }

    function map(options) {
        /*
         var options = {
         key: 'SAUCE',
         featurePath: path/to/featureFile
         }
         */
        return new Promise(function(resolve, reject) {
            if (options && fs.existsSync(backupFeaturesDirectory)) {

                var backupKeys = process.env[Keys.BACKUP_KEYS];

                if (!backupKeys) {
                    process.env[Keys.BACKUP_KEYS] = process.env[options.key];
                }

                options.values = process.env[Keys.BACKUP_KEYS];

                if (options.values) {
                    var values = options.values.split(',');

                    var index = _.findIndex(values, function(o) {
                        return options.featurePath.indexOf(o) >= 0;
                    });

                    if (index >= 0) {
                        log('setting \'%s\' to value \'%s\'', options.key, values[index]);
                        process.env[options.key] = values[index];
                        return resolve();
                    } else {
                        return reject('required options not found to map. options: ' + (options ? JSON.stringify(options) : undefined));
                    }
                } else {
                    log('Exiting. Options.values not provided %s', options);
                    return resolve();
                }
            } else {
                log('Exiting. Backup features directory not created');
                return resolve();
            }
        })
    }

    return {
        features: features,
        clean: clean,
        map: map
    };
};
