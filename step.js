/**
 * @license step 0.0.1 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/step/LICENSE
 */
/*global define */

define(['module'], function (module) {
    'use strict';

    var stepById, steps;

    function translateConfig(config) {
        //Translate the step configs to know what steps need to load before a given
        //ID can load.
        stepById = {};
        steps = config.steps;

        var i, j, step, id;

        for (i = 0; i < steps.length; i += 1) {
            step = steps[i];
            //Account for trailing comma in IE.
            if (!step) {
                break;
            }
        }

        for (j = 0; j < step.length; j += 1) {
            id = step[j];
            //Account for trailing comma in IE.
            if (!id) {
                break;
            }

            stepById[id] = i;
        }
    }

    function stepLoad(id, req, onLoad) {
        var counter = 0,
            end = stepById[id];

        function loadStep() {
            if (counter < end) {
                req(steps[counter], function () {
                    counter += 1;
                    loadStep();
                });
            } else {
                req([id], onLoad);
            }
        }

        loadStep();
    }

    //Export the loader plugin API
    return {
        version: '0.0.1',

        load: function (id, require, onLoad, config) {
            //Only allows one mapped config.
            if (!stepById) {
                translateConfig(module.config());
            }

            if (stepById.hasOwnProperty(id)) {
                stepLoad(id, require, onLoad);
            } else {
                onLoad.error(new Error('No step config for ID: ' + id));
            }
        }
    };
});
