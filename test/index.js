/* global chai, mocha, QYLIN_REPORT */
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

define(['../src/report-js.js', '../src/wrap.js'], function(report) {
    describe('init', function() {

        // close repeat
        QYLIN_REPORT.init({
            repeat: 10000
        });


        it(' use push and report ', function(done) {

            QYLIN_REPORT.init({
                id: 1,
                url: "http://test.qq.com/report",
                combo: 1,
                delay: 200,
                submit: function(url) {
                    var match1 = url.indexOf("errorTest1");
                    var match2 = url.indexOf("errorTest2");
                    var match3 = url.indexOf("errorTest3");
                    var match4 = url.indexOf("errorTest4");
                    var match5 = url.indexOf("count");
                    should.not.equal(match1, -1);
                    should.not.equal(match2, -1);
                    should.not.equal(match3, -1);
                    should.not.equal(match4, -1);
                    should.not.equal(match5, -1);
                    done();
                }
            });
            QYLIN_REPORT.push("errorTest1");
            QYLIN_REPORT.push("errorTest2");
            QYLIN_REPORT.push("errorTest3");
            QYLIN_REPORT.report("errorTest4", true);
        });


        it(' onerror and report ', function(done) {

            var count = 0;
            QYLIN_REPORT.init({
                id: 1,
                url: "http://test.qq.com/report",
                delay: 200,
                submit: function(url) {
                    count++;

                }
            });
            QYLIN_REPORT.__onerror__("msg", 0, 0, null);
            QYLIN_REPORT.report(null , true);

            setTimeout(function() {
                should.equal(count, 1);
                done();
            }, 500);
        });


        it('onReport callback ', function(done) {

            var count = 0;
            QYLIN_REPORT.init({
                id: 1,
                url: "http://test.qq.com/report",
                delay: 200,
                submit: function(url) {
                    count++;
                    should.equal(count, 2);
                    done();
                },
                onReport: function() {
                    count++;
                }
            });
            QYLIN_REPORT.report("errorTest4", true);
        });


        it('ignore report1 ', function(done) {

            var count = 0;
            QYLIN_REPORT.init({
                id: 1,
                url: "http://test.qq.com/report",
                delay: 200,
                ignore: [
                    /ignore/gi,
                    function(error, str) {

                        if (str.indexOf("ignore2") >= 0) {
                            return true;
                        } else {
                            false;
                        }

                    }
                ],
                submit: function(url) {
                    should.equal(count, 1);
                    done();
                    QYLIN_REPORT.init({
                        ignore: []
                    });
                },
                onReport: function() {
                    count++;
                }
            });
            QYLIN_REPORT.push("ignore");
            QYLIN_REPORT.push("pass");
            QYLIN_REPORT.report("ignore2", true);
        });


        it('ignore report2 ', function(done) {
            var count = 0;
            QYLIN_REPORT.init({
                id: 1,
                url: "http://test.qq.com/report",
                delay: 200,
                ignore: [
                    /ignore/gi,
                    function(error, str) {
                        return str.indexOf("ignore2") >= 0;
                    }
                ],
                submit: function(url) {
                    should.equal(count, 3);
                    done();
                    QYLIN_REPORT.init({
                        ignore: []
                    });
                },
                onReport: function() {
                    count++;
                }
            });
            QYLIN_REPORT.push("pass");
            QYLIN_REPORT.push("pass");
            QYLIN_REPORT.report("pass", true);
        });


        it('report Error Event', function(done, err) {

            QYLIN_REPORT.init({
                id: 1,
                url: "http://test.qq.com/report",
                delay: 200,
                submit: function(url) {
                    var match1 = url.indexOf("ReferenceError");
                    should.not.equal(match1, -1);
                    done();
                }
            }).tryJs().spyAll();

            try {
                error111; // jshint ignore:line
            } catch (e) {
                QYLIN_REPORT.report(e);
            }

        });

        it('repeat check', function(done, err) {

            QYLIN_REPORT.init({
                id: 1,
                url: "http://test.qq.com/report",
                delay: 1000,
                repeat: 1,
                submit: function(url) {
                    var match_count = (url.match(/repeatTest/g) || []).length;
                    should.equal(match_count, 1);
                    done();
                    // close repeat
                    QYLIN_REPORT.init({
                        repeat: 1e10
                    });
                }
            }).tryJs().spyAll();

            QYLIN_REPORT.push('repeatTest');
            QYLIN_REPORT.push('repeatTest');
            QYLIN_REPORT.push('repeatTest');
            QYLIN_REPORT.report('repeatTest' , true);
        });
    });


    describe('spy', function() {

        it('spyCustom', function(done, err) {

            var spyCustomFun = function() {
                throw "errorTest1";
            };

            spyCustomFun = QYLIN_REPORT.init({
                id: 1,
                url: "http://test.qq.com/report",
                delay: 200,
                submit: function(url) {
                    var match1 = url.indexOf("errorTest1");
                    should.not.equal(match1, -1);
                    done();
                }
            }).tryJs().spyCustom(spyCustomFun);

            (function() {
                spyCustomFun();
            }).should.throw();
        });


        it('spyAll', function(done, err) {
            var _cb;

            window.require = function(requires, cb) {

            };
            window.define = function(name, cb) {
                if (_cb) {
                    _cb();
                } else {
                    _cb = cb;
                }
            };
            window.define.amd = true;

            QYLIN_REPORT.init({
                id: 1,
                url: "http://test.qq.com/report",
                delay: 200,
                submit: function(url) {
                    var match1 = url.indexOf("testDefine");
                    should.not.equal(match1, -1);
                    done();
                }
            }).tryJs().spyAll();

            define("testDefine", function() {
                throw "testDefine";
            });

            (function() {
                console.log(window.define);
                define();
            }).should.throw();
        });



    });
});
