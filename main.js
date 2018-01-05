"use strict";
exports.__esModule = true;
var spinner_1 = require("./spinner");
var tune_1 = require("./tune");
var ampm_1 = require("./ampm");
var timer_1 = require("./timer");
var range_1 = require("./range");
var multitune_1 = require("./multitune");
Object.defineProperty(window, 'FlatGauge', {
    value: {
        Spinner: spinner_1.Spinner,
        Tune: tune_1.Tune,
        AmPm: ampm_1.AmPm,
        Timer: timer_1.Timer,
        Range: range_1.Range,
        MultiTune: multitune_1.MultiTune
    }
});
