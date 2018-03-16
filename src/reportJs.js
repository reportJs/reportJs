window.reportJs = (function(win, doc, config) {
    'use strict'

    var url_api = config.url, //'http://children-log.code-test.100tal.com/',
        method = config.method ? config.method : 'post',
        url_js = 'https://static.i-vectors.com/tracker.min.js',
        version = '0.1.0',
        delay = config.delay, // 延迟上报
        NUM_I = 1,
        NUM_II = 2,
        NUM_IV = 4,
        NUM_VIII = 8,
        code_js_error = 256, // js 错误
        type_load = 512, // 加载类型
        code_404 = 404, //
        code_console_log = 257,
        code_console_warn = 258,
        code_console_error = 259,
        code_src_error = 514,
        k_test = 768,
        D_test = 769,
        S_test = 770,
        code_xhr_ = 771,
        C_test = 772,
        code_load_time = 1024,
        code_user_report = 16,
        submit_log_list = [],
        comboTimeout = 0

    function n_error(e) {
        if (!e.message) return !0
        var r = w_Util.composeScriptErrorData(
            code_js_error,
            e.message,
            e.filename,
            e.lineno,
            e.colno,
            e.error
        )
        w_Util.checkCrossOrigin(e.filename, L_Checker.exclude) &&
            L_Checker.behaviour & NUM_I &&
            format_send(code_js_error, r)
    }
    function o_error(e) {
        var r = e.target.tagName,
            t = e.target.src || e.target.href
        if (
            !(
                w_Util.checkCrossOrigin(t, L_Checker.exclude) &&
                L_Checker.behaviour & NUM_II &&
                t
            )
        )
            return !0
        if ('load' === e.type) {
            if (w_Util.checkCrossOrigin(t, L_Checker.origin)) {
                var n = w_Util.composeResourceErrorData(code_src_error, r, t)
                format_send(type_load, n)
            }
        } else
            'error' === e.type &&
                ((n = w_Util.composeResourceErrorData(code_404, r, t)),
                format_send(type_load, n))
    }
    function a(e) {
        var r = e.target
        if (
            !(
                w_Util.checkCrossOrigin(
                    r.tracker._request_url,
                    L_Checker.exclude
                ) && L_Checker.behaviour & NUM_IV
            )
        )
            return !0
        if ('readystatechange' === e.type) {
            var t = [
                '_time_init',
                '_time_open',
                '_time_send',
                '_time_load',
                '_time_done'
            ]
            if (
                (t[r.readyState] &&
                    (r.tracker[t[r.readyState]] = w_Util.getTime()),
                4 === r.readyState)
            ) {
                r.tracker._status = r.status
                var n = w_Util.calculateTrackerTiming(r.tracker)
                if (
                    w_Util.checkCrossOrigin(
                        r.tracker._request_url,
                        L_Checker.origin
                    )
                ) {
                    var o = w_Util.composeXHRErrorData(
                        C_test,
                        r.tracker._request_url,
                        { status: r.tracker._status },
                        n
                    )
                    format_send(k_test, o)
                }
                ;(n.send || n.load || n.total || r.tracker._status) &&
                    ((o = w_Util.composeXHRErrorData(
                        code_xhr_,
                        r.tracker._request_url,
                        { status: r.tracker._status },
                        n
                    )),
                    format_send(k_test, o))
            }
        } else
            'error' === e.type
                ? ((r.tracker._status = r.status),
                  (o = w_Util.composeXHRErrorData(
                      D_test,
                      r.tracker._request_url,
                      { status: r.tracker._status },
                      n
                  )),
                  format_send(k_test, o))
                : 'timeout' === e.type &&
                  ((r.tracker._status = r.status),
                  (o = w_Util.composeXHRErrorData(
                      S_test,
                      r.tracker._request_url,
                      { status: r.tracker._status },
                      n
                  )),
                  format_send(k_test, o))
    }
    function format_send(e, r) {
        var t = w_Util.composeTrackerData(e, r)

        ;(t.currentURL = w_Util.getCurrentURL()),
            (t.refererURL = w_Util.getRefererURL()),
            (t.messageID = e === code_load_time ? q_guid : w_Util.getGUID()),
            send(t)
    }
    function send(par_date) {
        if (delay == 0) {
            do_send(par_date) // 立即上报
        } else {
            submit_log_list.push(par_date)
            if (method == 'post') {
                if (comboTimeout == 0) {
                    comboTimeout = setTimeout(function() {
                        comboTimeout = 0
                        var e = submit_log_list.slice(0)
                        submit_log_list.length = 0
                        do_send(e)
                    }, delay) // 延迟上报
                } else if (submit_log_list.length > 5) {
                    var e = submit_log_list.slice(0)
                    submit_log_list.length = 0
                    do_send(e)
                }
            } else {
                comboTimeout = setTimeout(function() {
                    comboTimeout = 0
                    var len = submit_log_list.length
                    for (var i = 0; i < len; i++) {
                        var e = submit_log_list.shift()
                        do_send(e)
                    }
                }, delay) // 延迟上报
            }
        }
    }
    function do_send(par_date) {
        if (par_date.length <= 0) return
        // Merge the same field
        var data = {
            clientID: w_Util.getClientID(),
            token: L_Checker.token,
            version: version,
            userData: L_Checker.userData,
            viewPort : w_Util.getViewPortSize(),
            infos: par_date
        }

        var _date = JSON.stringify(data)
        if (method == 'post') {
            var n = new win.XMLHttpRequest()
            // n.setRequestHeader('Content-type', 'application/json')
            n.open('POST', url_api, !0), n.send(_date)
        } else {
            var url =
                url_api +
                'data=' +
                encodeURIComponent(_date) +
                '&_t=' +
                +new Date()
            var _img = new Image()
            _img.src = url
        }
    }
    var fnFormatError = function(e, r) {
        r = r || ''
        var errors = {
            1001: 'Invalid token',
            1002: 'Invalid behaviour settings',
            1003: 'Invalid origin settings',
            1004: 'Invalid exclude settings',
            1005: 'Invalid user data',
            4e3: 'Bad configuration! Fail to start!',
            4001: 'window.reportJs is already defined, Fail to start!'
        }
        errors[e] &&
            console.warn(
                [
                    'Error(reportjs):',
                    errors[e],
                    '(CODE' + e + ')',
                    'See https://reportjs.com/error/' +
                        e +
                        '/' +
                        encodeURIComponent(r)
                ].join(' ')
            )
    }

    var fnUserReport = function(msg, detail) {
        var n = w_Util.composePerformaceData(msg, detail)
        format_send(code_user_report, n)
    }

    if (win.reportJs) return fnFormatError(4001), win.reportJs
    var R_Checker = {
            tokenChecker: function(e) {
                return e && e.match(/^\w{32}$/) ? 0 : 1
            },
            behaviourChecker: function(e) {
                return e <= (NUM_I | NUM_II | NUM_IV | NUM_VIII) ? 0 : 1
            },
            urlSettingChecker: function(e) {
                e = e || []
                for (var r = 0; r < e.length; r++)
                    if ('string' == typeof e[r]);
                    else if (!e[r].test) return e[r]
                return 0
            },
            KVArrayChecker: function(e) {
                e = e || {}
                for (var r in e) if ('object' == typeof e[r]) return r
                return 0
            }
        },
        w_Util = {
            KVArrayCopy: function(e) {
                var r = {}
                for (var t in e) r[t] = e[t]
                return r
            },
            uriArrayCopy: function(e) {
                e = e || []
                for (var r = [], t = 0; t < e.length; t++)
                    'string' == typeof e[t]
                        ? r.push(e[t])
                        : r.push(new RegExp(e[t].source, e[t].flag))
                return r
            },
            getTime: function() {
                return new Date().getTime()
            },
            getGUID: function() {
                var e = [
                        '0',
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9',
                        'a',
                        'b',
                        'c',
                        'd',
                        'e',
                        'f'
                    ],
                    r = w_Util.getTime().toString(16)
                for (r = '0' + r; r.length < 16; ) r = 'f' + r
                for (; r.length < 32; ) r += e[Math.floor(16 * Math.random())]
                return r
            },
            addSlashes: function(e) {
                var r = /(\.|\\|\/|\||\+|\$|\^)/g
                return e.replace(r, '\\$1')
            },
            filterTrace: function(e) {
                var r = new RegExp(
                    '((?!\n).)*' + w_Util.addSlashes(url_js) + '.*\n',
                    'g'
                )
                return e.replace(r, '')
            },
            getUserAgent: function() {
                return win.navigator.userAgent
            },
            getCurrentURL: function() {
                return win.location.href
            },
            getRefererURL: function() {
                return doc.referrer
            },
            getViewPortSize: function() {
                return {
                    w: win.innerWidth,
                    h: win.innerHeight,
                    r: win.devicePixelRatio
                }
            },
            getClientID: function() {
                return win.localStorage
                    ? (win.localStorage.getItem('reportjs:client:id') ||
                          win.localStorage.setItem(
                              'reportjs:client:id',
                              w_Util.getGUID()
                          ),
                      win.localStorage.getItem('reportjs:client:id'))
                    : w_Util.getGUID()
            },
            getSessionID: function() {
                return win.sessionStorage
                    ? (win.sessionStorage.getItem('reportjs:session:id') ||
                          win.sessionStorage.setItem(
                              'reportjs:session:id',
                              w_Util.getGUID()
                          ),
                      win.sessionStorage.getItem('reportjs:session:id'))
                    : w_Util.getGUID()
            },
            checkCrossOrigin: function(e, r) {
                if (r) {
                    e = e || ''
                    for (var t = !1, n = 0; n < r.length; n++)
                        e.match(r[n]) && (t |= !0)
                    return !t
                }
                return !1
            },
            checkTimingSlow: function(e, r) {
                return (
                    !!r &&
                    ((e.send > r.sned && r.sned > 0) ||
                        (e.load > r.load && r.load > 0) ||
                        (e.total > r.total && r.total > 0))
                )
            },
            calculateTrackerTiming: function(e) {
                return e._time_done &&
                    e._time_load &&
                    e._time_send &&
                    e._time_done
                    ? {
                          send: e._time_send - e._time_open,
                          load: e._time_load - e._time_send,
                          total: e._time_done - e._time_open
                      }
                    : { send: 0, load: 0, total: 0 }
            },
            composeTrackerData: function(e, r) {
                return { type: e, data: r }
            },
            composeScriptErrorData: function(e, r, t, n, o, a) {
                return (
                    (a = a && a.stack ? a.stack.toString() : ''),
                    (a = w_Util.filterTrace(a)),
                    {
                        message: e,
                        detail: {
                            err: r,
                            file: t,
                            line: n,
                            column: o,
                            trace: a
                        }
                    }
                )
            },
            composeXHRErrorData: function(e, r, t, n) {
                return {
                    message: e,
                    detail: { requestURL: r, responseData: t, timing: n }
                }
            },
            composeResourceErrorData: function(e, r, t) {
                return { message: e, detail: { tagname: r, resourceURL: t } }
            },
            composePerformaceData: function(e, r) {
                return { message: e, detail: r }
            }
        },
        L_Checker = (function(cfg) {
            var t = {},
                n = !0
            if (
                (R_Checker.tokenChecker(cfg.token)
                    ? (fnFormatError(1001), (n &= !1))
                    : (t.token = cfg.token.toString()),
                R_Checker.behaviourChecker(cfg.behaviour)
                    ? (fnFormatError(1002), (n &= !1))
                    : ((t.behaviour = parseInt(cfg.behaviour)),
                      t.behaviour ||
                          (t.behaviour = NUM_I | NUM_II | NUM_IV | NUM_VIII)),
                R_Checker.urlSettingChecker(cfg.origin))
            ) {
                var o = R_Checker.urlSettingChecker(cfg.behaviour)
                fnFormatError(1003, o), (n &= !1)
            } else
                (t.origin = w_Util.uriArrayCopy(cfg.origin)),
                    t.origin.push(win.location.origin),
                    t.origin.push(/^((?!:\/\/).)*$/),
                    t.origin.push(url_js),
                    t.origin.push(url_api)
            return (
                R_Checker.urlSettingChecker(cfg.exclude)
                    ? ((o = R_Checker.urlSettingChecker(cfg.exclude)),
                      fnFormatError(1004, o),
                      (n &= !1))
                    : ((t.exclude = w_Util.uriArrayCopy(cfg.exclude)),
                      t.exclude.push(url_js),
                      t.exclude.push(url_api)),
                R_Checker.KVArrayChecker(cfg.userData)
                    ? ((o = R_Checker.KVArrayChecker(cfg.userData)),
                      fnFormatError(1005, o),
                      (n &= !1))
                    : (t.userData = w_Util.KVArrayCopy(cfg.userData)),
                !!n && t
            )
        })(config)
    if (!L_Checker) return fnFormatError(4e3), !1
    if (win.console) {
        var log = win.console.log,
            warn = win.console.warn,
            error = win.console.error
        ;(win.console.log = function() {
            var r = [].slice.call(arguments)
            if (!r.length) return !0
            var t = w_Util.composeScriptErrorData(
                code_console_log,
                r.join(', ').substr(0, 1e3),
                'via console.log',
                0,
                0,
                new Error(r.join(', ').substr(0, 1e3))
            )
            L_Checker.behaviour & NUM_I && format_send(code_js_error, t),
                log.apply(win.console, r)
        }),
            (win.console.warn = function() {
                var r = [].slice.call(arguments)
                if (!r.length) return !0
                var t = w_Util.composeScriptErrorData(
                    code_console_warn,
                    r.join(', ').substr(0, 1e3),
                    'via console.warn',
                    0,
                    0,
                    new Error(r.join(', ').substr(0, 1e3))
                )
                L_Checker.behaviour & NUM_I && format_send(code_js_error, t),
                    warn.apply(win.console, r)
            }),
            (win.console.error = function() {
                var r = [].slice.call(arguments)
                if (!r.length) return !0
                var t = w_Util.composeScriptErrorData(
                    code_console_error,
                    r.join(', ').substr(0, 1e3),
                    'via console.error',
                    0,
                    0,
                    new Error(r.join(', ').substr(0, 1e3))
                )
                L_Checker.behaviour & NUM_I && format_send(code_js_error, t),
                    error.apply(win.console, r)
            })
    }
    var xh = new win.XMLHttpRequest()
    if (!xh._tracker_open && !xh.tracker) {
        var Request = win.XMLHttpRequest
        win.XMLHttpRequest = function() {
            var e = new Request()
            return (
                (e._tracker_open = e.open),
                (e.tracker = {
                    _time_init: 0,
                    _time_open: 0,
                    _time_send: 0,
                    _time_load: 0,
                    _time_done: 0,
                    _request_method: '',
                    _request_url: '',
                    _status: ''
                }),
                e.addEventListener('error', a),
                e.addEventListener('timeout', a),
                e.addEventListener('readystatechange', a),
                (e.open = function(r, t, n, o, a) {
                    return (
                        (e.tracker._request_method = r),
                        (e.tracker._request_url = t),
                        (e.tracker._time_open = w_Util.getTime()),
                        e._tracker_open(r, t, n, o, a)
                    )
                }),
                e
            )
        }
    }
    var q_guid = w_Util.getGUID()
    win.addEventListener(
        'beforeunload',
        function(r) {
            if (
                win.performance &&
                win.performance.timing &&
                L_Checker.behaviour & NUM_VIII
            ) {
                var t = {}
                ;(t.dns =
                    win.performance.timing.domainLookupEnd -
                    win.performance.timing.domainLookupStart),
                    (t.connect =
                        win.performance.timing.connectEnd -
                        win.performance.timing.connectStart),
                    (t.request =
                        win.performance.timing.responseStart -
                        win.performance.timing.requestStart),
                    (t.response =
                        win.performance.timing.responseEnd -
                        win.performance.timing.responseStart),
                    (t.dom =
                        win.performance.timing.domInteractive -
                        win.performance.timing.domLoading),
                    (t.domContent =
                        win.performance.timing.domComplete -
                        win.performance.timing.domInteractive),
                    (t.load =
                        win.performance.timing.domComplete -
                        win.performance.timing.domainLookupStart),
                    (t.view =
                        new Date().getTime() -
                        win.performance.timing.domComplete)
                var n = w_Util.composePerformaceData(code_load_time, t)
                format_send(code_load_time, n)
            }
        },
        !0
    ),
        win.addEventListener(
            'load',
            function(r) {
                if (
                    win.performance &&
                    win.performance.timing &&
                    L_Checker.behaviour & NUM_VIII
                ) {
                    var t = {}
                    ;(t.dns =
                        win.performance.timing.domainLookupEnd -
                        win.performance.timing.domainLookupStart),
                        (t.connect =
                            win.performance.timing.connectEnd -
                            win.performance.timing.connectStart),
                        (t.request =
                            win.performance.timing.responseStart -
                            win.performance.timing.requestStart),
                        (t.response =
                            win.performance.timing.responseEnd -
                            win.performance.timing.responseStart),
                        (t.dom =
                            win.performance.timing.domInteractive -
                            win.performance.timing.domLoading),
                        (t.domContent =
                            win.performance.timing.domComplete -
                            win.performance.timing.domInteractive),
                        (t.load =
                            win.performance.timing.domComplete -
                            win.performance.timing.domainLookupStart)
                    var n = w_Util.composePerformaceData(code_load_time, t)
                    format_send(code_load_time, n)
                }
            },
            !0
        ),
        win.addEventListener('error', n_error, !0),
        doc.addEventListener('error', o_error, !0),
        doc.addEventListener('load', o_error, !0)
    var A_TRY = (function(e) {
        function r(e) {
            e.message || (e = new Error(e)),
                (e.error = e),
                (e.filename = e.filename ? e.filename : ''),
                (e.filename += ' via reportjs try - catch API'),
                (e.lineno = e.lineno ? e.lineno : 0),
                (e.colno = e.colno ? e.colno : 0),
                n_error(e)
        }
        return {
            try: function() {
                var e = arguments[0],
                    t = arguments[1]
                try {
                    e.apply(t, [].slice.call(arguments, 2))
                } catch (e) {
                    r(e)
                }
            },
            catch: r,
            composedTry: function(e, t) {
                return function() {
                    try {
                        e.apply(t, [].slice.call(arguments))
                    } catch (e) {
                        r(e)
                    }
                }
            },
            addUserData: function(key, value) {
                return (e.userData[key] = value), !0
            },
            removeUserData: function(r) {
                delete e.userData[r]
            }
        }
    })(L_Checker)
    return {
        C: {
            SCRIPT: NUM_I,
            RESOURCE: NUM_II,
            XHR: NUM_IV,
            PERFOMACE: NUM_VIII
        },
        V: version,
        try: A_TRY.try,
        catch: A_TRY.catch,
        composedTry: A_TRY.composedTry,
        addUserData: A_TRY.addUserData,
        removeUserData: A_TRY.removeUserData,
        userReport: fnUserReport
    }
})(window, document, window.reportJsConfig)
