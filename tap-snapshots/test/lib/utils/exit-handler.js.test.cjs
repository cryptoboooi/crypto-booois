/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/lib/utils/exit-handler.js TAP handles unknown error with logs and debug file > debug file contents 1`] = `
XX timing npm:load:whichnode Completed in {TIME}ms
XX timing config:load Completed in {TIME}ms
XX timing npm:load:configload Completed in {TIME}ms
XX timing npm:load:mkdirpcache Completed in {TIME}ms
XX timing npm:load:mkdirplogs Completed in {TIME}ms
XX verbose title npm
XX verbose argv "--fetch-retries" "0" "--cache" "{CWD}/cache" "--loglevel" "notice" "--color" "false" "--timing" "true"
XX timing npm:load:setTitle Completed in {TIME}ms
XX timing npm:load:display Completed in {TIME}ms
XX verbose logfile logs-max:10 dir:{CWD}/cache/_logs/{DATE}-
XX verbose logfile {CWD}/cache/_logs/{DATE}-debug-0.log
XX timing npm:load:logFile Completed in {TIME}ms
XX timing npm:load:timers Completed in {TIME}ms
XX timing npm:load:configScope Completed in {TIME}ms
XX timing npm:load Completed in {TIME}ms
XX verbose stack Error: Unknown error
XX verbose cwd {CWD}/prefix
XX verbose Foo 1.0.0
XX verbose node v1.0.0
XX verbose npm  v1.0.0
XX error code ECODE
XX error ERR SUMMARY Unknown error
XX error ERR DETAIL Unknown error
XX verbose exit 1
XX timing npm Completed in {TIME}ms
XX verbose code 1
XX error Timing info written to: {CWD}/cache/_logs/{DATE}-timing.json
XX error A complete log of this run can be found in: {CWD}/cache/_logs/{DATE}-debug-0.log
`

exports[`test/lib/utils/exit-handler.js TAP handles unknown error with logs and debug file > logs 1`] = `
timing npm:load:whichnode Completed in {TIME}ms
timing config:load Completed in {TIME}ms
timing npm:load:configload Completed in {TIME}ms
timing npm:load:mkdirpcache Completed in {TIME}ms
timing npm:load:mkdirplogs Completed in {TIME}ms
timing npm:load:setTitle Completed in {TIME}ms
timing npm:load:display Completed in {TIME}ms
timing npm:load:logFile Completed in {TIME}ms
timing npm:load:timers Completed in {TIME}ms
timing npm:load:configScope Completed in {TIME}ms
timing npm:load Completed in {TIME}ms
error code ECODE
error ERR SUMMARY Unknown error
error ERR DETAIL Unknown error
timing npm Completed in {TIME}ms
error Timing info written to: {CWD}/cache/_logs/{DATE}-timing.json
npm ERR! A complete log of this run can be found in: {CWD}/cache/_logs/{DATE}-debug-0.log
`
