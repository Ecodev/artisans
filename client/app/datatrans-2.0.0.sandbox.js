/* globals define module */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Datatrans = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    var extend = function(defaults, options) {
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    };

    var createElementWithAttributes = function(tag, attrs) {
        var elem = document.createElement(tag);
        if (!attrs) {
            return elem;
        }

        Object.keys(attrs).forEach(function(name) {
            elem.setAttribute(name, attrs[name]);
        });

        return elem;
    };

    var getData = function(elem) {
        return Array.prototype.slice.call(elem.attributes)
                    .filter(function(item) {
                        return item.name.indexOf('data-') === 0;
                    })
                    .reduce(function(result, item) {
                        var normalizedName = item.name
                                                 .replace(/^data-/, '')
                                                 .replace(/-([a-z])/g, function(g) {
                                                     return g[1].toUpperCase();
                                                 }); // dash to camel-case

                        result[normalizedName] = item.value;

                        return result;
                    }, {});
    };

    var stringifyReplacer = function(key, value) {
        if ((key.length > 0) && typeof value === 'object') {
            return undefined;
        }
        return value;
    };

    var lockStyles = {
        html: {
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        },
        body: {
            width: '100%',
            height: '100%',
            overflow: 'visible',
            position: 'fixed'
        }
    };

    var preservedStyles = {};

    var toggleLockHostpage = function(toggle) {
        var html = document.documentElement; // '<html>'
        var body = document.body;
        var lockAttr = html.getAttribute('data-datatrans-payment-lock') || 'unlocked';
        var doActivate = toggle !== undefined ? toggle : lockAttr === 'unlocked';
        var scrollPos;

        if (doActivate) {
            html.setAttribute('data-datatrans-payment-lock', 'locked');
            scrollPos = body.scrollTop;
            preservedStyles = {
                html: html.getAttribute('style'),
                body: body.getAttribute('style')
            };
            Object.keys(lockStyles.html || {}).forEach(function(key) {
                html.style[key] = lockStyles.html[key];
            });
            Object.keys(lockStyles.body || {}).forEach(function(key) {
                body.style[key] = lockStyles.body[key];
            });
            body.style.top = -scrollPos;
        } else {
            scrollPos = -(parseInt(body.style.top, 10));
            html.setAttribute('style', preservedStyles.html);
            body.setAttribute('style', preservedStyles.body);
            body.scrollTop = scrollPos;
            body.style.top = '';
            html.setAttribute('data-datatrans-payment-lock', 'unlocked');
        }
    };

    var paymentFrame;
    var paymentForm;
    var windowEventHandler;
    var cleanup;

    var startPayment = function(config) {
        cleanup = function() {
            toggleLockHostpage(false);
            paymentForm.parentNode.removeChild(paymentForm);
            paymentFrame.parentNode.removeChild(paymentFrame);
            if (window.removeEventListener) {
                window.removeEventListener('message', windowEventHandler);
            } else if (window.detachEvent) {
                window.detachEvent('message', windowEventHandler);
            }
        };

        toggleLockHostpage();

        if (typeof config.opened === 'function') {
            config.opened();
        }

        var params = {};

        if (config.form !== undefined) {
            var form = document.querySelector(config.form);

            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                });

                params = getData(form);
            }
        }

        if (params !== undefined) {
            params = extend(params, config.params);
        }

        params['theme'] = 'DT2015';
        params['version'] = datatransPaymentConfig.version;

        var action = datatransPaymentConfig.endpoint + '/upp/jsp/upStart.jsp';
        var method = 'post';

        if (config.paymentId !== undefined) {
            action = datatransPaymentConfig.endpoint + '/upp/v1/start/' + config.paymentId;
            method = 'get';
        }

        var needsRedirect = false;
        var selectedPaymentMethods = params['paymentmethod'];
        var redirectUrl = action + '?';
        if (selectedPaymentMethods && selectedPaymentMethods.indexOf(',') === -1) {
            if (datatransPaymentConfig.fullscreenMethods.indexOf(selectedPaymentMethods) !== -1) {
                needsRedirect = true;
            }
        }

        needsRedirect = needsRedirect || isRunningInStandaloneMode();

        if (!needsRedirect) {
            paymentForm = createElementWithAttributes('form', {
                id: 'datatransPaymentForm',
                name: 'datatransPaymentForm',
                'method': method,
                style: 'display: none;',
                action: action,
                target: 'datatransPaymentFrame'
            });

            for (var name in params) {
                if (name === 'paymentmethod') {
                    var paymentMethod = params[name];

                    if (!paymentMethod) {
                        continue;
                    }

                    if (paymentMethod.indexOf(',') !== -1) {
                        paymentMethod.split(',').forEach(function(value) {
                            paymentForm.appendChild(createElementWithAttributes('input', {
                                type: 'hidden',
                                name: name,
                                value: value
                            }));
                        });
                        continue;
                    }
                }

                if (typeof params[name] === 'object') {
                    paymentForm.appendChild(createElementWithAttributes('input', {
                        type: 'hidden',
                        name: name,
                        value: JSON.stringify(params[name], stringifyReplacer)
                    }));
                } else {
                    paymentForm.appendChild(createElementWithAttributes('input', {
                        type: 'hidden',
                        name: name,
                        value: params[name]
                    }));
                }
            }

            if (!params.uppReturnTarget) {
                paymentForm.appendChild(createElementWithAttributes('input', {
                    type: 'hidden',
                    name: 'uppReturnTarget',
                    value: '_top'
                }));
            }

            paymentFrame = createElementWithAttributes('div', {
                id: 'paymentFrameWrapper',
                style: 'z-index: 9999; position: fixed; right: 0; bottom: 0; left: 0; top: 0; overflow: hidden; -webkit-transform: translate3d(0, 0, 0); display: none'
            });

            paymentFrame.appendChild(createElementWithAttributes('iframe', {
                id: 'datatransPaymentFrame',
                name: 'datatransPaymentFrame',
                frameborder: '0',
                allowtransparency: 'true',
                style: 'border: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-transform: translate3d(0, 0, 0);'
            }));

            paymentForm.appendChild(createElementWithAttributes('input', {
                type: 'hidden',
                name: 'mode',
                value: 'lightbox'
            }));
            document.body.appendChild(paymentFrame);
            document.body.appendChild(paymentForm);
        } else {
            var urlParams = [];
            for (var key in params) {
                if (typeof params[key] === 'object') {
                    urlParams.push(key + '=' + encodeURIComponent(JSON.stringify(params[key], stringifyReplacer)));
                } else if (key === 'paymentmethod') {
                    var paymentMethod = params[key];

                    if (!paymentMethod) {
                        continue;
                    }

                    paymentMethod.split(',').forEach(function(value) {
                        urlParams.push(key + '=' + encodeURIComponent(value));
                    });
                }
                else {
                    urlParams.push(key + '=' + encodeURIComponent(params[key]));
                }
            }
            redirectUrl += urlParams.join('&');
        }

        windowEventHandler = function(event) {
            if (event.origin !== datatransPaymentConfig.endpoint) {
                // return;
            }

            if (event.data === 'cancel') {
                if (typeof config.closed === 'function') {
                    config.closed();
                }
                cleanup();
                return;
            }

            if (event.data === 'frameReady') {
                if (typeof config.loaded === 'function') {
                    config.loaded();
                }
                paymentFrame.style.display = 'block';
                return;
            }

            if (typeof event.data === 'object' && event.data.type === 'error') {
                if (typeof config.error === 'function') {
                    var errorData = {
                        message: event.data.message,
                        detail: event.data.detail
                    };

                    config.error(errorData);
                }
                cleanup();
                return;
            }

            if (typeof event.data === 'object' && event.data.type === 'success') {

                if (typeof config.success === 'function') {
                    var errorData = {
                        message: event.data.message,
                        detail: event.data.detail
                    };

                    config.success(errorData);
                }
                cleanup();
                return;
            }
        };

        if (window.addEventListener) {
            window.addEventListener('message', windowEventHandler);
        } else if (window.attachEvent) {
            window.attachEvent('message', windowEventHandler);
        }

        if (needsRedirect) {
            location.href = redirectUrl;
        } else {
            paymentForm.submit();
        }
    };

    var isRunningInStandaloneMode = function() {
        if (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }

        if (window.navigator.standalone === true) {
            return true;
        }

        return false;
    };

    return {
        startPayment: startPayment,
        close: function() {
            if (typeof cleanup === 'function') {
                cleanup();
            }
        }
    };
}));

var datatransPaymentConfig = {
    "endpoint": "https://pay.sandbox.datatrans.com",
    "version": "2.0.0",
    "fullscreenMethods": ["PAP", "CUR", "SAM", "INT", "PFC", "SWB", "TWI", "PSC", "CFY", "REK"]
};
