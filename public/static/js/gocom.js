if (navigator.userAgent.match(/QtWebEngine/i)) {
    document.write("<script src=\"qrc:///qtwebchannel/qwebchannel.js\"><\/script>");
}
; (function (qtwebdoc) {
    'use strict';
    window.onload = function () {
        if (typeof QWebChannel === 'function') {
            window.channel = new QWebChannel(qt.webChannelTransport, function (channel) {
                window.qtCmdHandler = channel.objects.qtCmdHandler;
            });
        }
    };
})(this);

; (function (global) {
    'use strict';
    var GoCom_JS_VERSION = '1.1.0';
    var GoCom_CMD_SCHEME = 'GoComCmd';
    var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function (bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function (c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                + fromCharCode(0x80 | (cc & 0x3f))) : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                    + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                    + fromCharCode(0x80 | (cc & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                + fromCharCode(0x80 | (cc & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function (u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function (ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16
                | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
            chars = [
                b64chars.charAt(ord >>> 18),
                b64chars.charAt((ord >>> 12) & 63),
                padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
            ];
        return chars.join('');
    };
    var btoa = global.btoa ? function (b) {
        return global.btoa(b);
    } : function (b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = function (u) { return btoa(utob(u)) };
    var encode = function (u, urisafe) {
        return !urisafe ? _encode(u)
            : _encode(u).replace(/[+\/]/g, function (m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function (u) { return encode(u, true) };
    global.Base64 = {
        VERSION: GoCom_JS_VERSION,
        btoa: btoa,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI
    };

    var xhr;
    //show up the selecting users dialog
    var __selectUser = function (preSelectedUsers, isMulti, successCallback, failureCallback) {

        var args = {
            selType: "2",
            selObjType: "3",
            fromContacts: "true",
            fromGroup: "false",
            fromLink: "true",
            fromRecent: "true",
            fromApp: "false",
            fromLabel: "false",
            title: "添加联系人",
            selLimit: "",
            selectedChange: "true",
            selectedUsers: "",
            selectedGrp: "",
            selectedApp: "",
            banUsers: ""
        };

        args.selectedUsers = preSelectedUsers;
        args.selObjType = "1"; //只选人

        if (isMulti) {
            args.selType = "1";//多选
        } else {
            args.selType = "0";//单选
        }

        __selectUserEx(args, successCallback, failureCallback);

    };

    var __selectUserEx = function (param, successCallback, failureCallback) {
        var str = JSON.stringify(param);
        runCmd('selectUsers', param, successCallback, failureCallback);

    };

    var __showInfo = function (showUserId) {
        var args = { userId: showUserId };
        runCmd('showInfo', args);
    };

    var __uploadFile = function (successCallback, failureCallback) {
        runCmd('uploadFile', null, successCallback, failureCallback);
    };

    var __getLocation = function (successCallback, failureCallback) {
        runCmd('getLocation', null, successCallback, failureCallback);
    };

    var __chatWithUser = function (chatUserId) {
        var args = { userId: chatUserId };
        runCmd('chatWithUser', args);
    };

    //capture an image
    // args edit : editable ,
    //posturl :the server url to post the picture. if specified,gocom client will post the file to this url with an file type input field named "file"
    //successCallback:   filepath,the local native file path of the picture.
    //uploaded : true or false, tell us whether the uploading operation is successful.
    var __capture = function (args, successCallback, failureCallback) {
        runCmd('capture', args, successCallback, failureCallback);
    };

    var __openWindow = function (windowUrl, appid) {
        runCmd('openWindow', { url: windowUrl, appid: appid });
    };

    var __tdcode = function (successCallback) {
        runCmd('tdcode', null, successCallback, null);
    };

    //launch the native app with the given url,if failed,calling back with the failCallback function.
    var __launchApp = function (appName, failCallback) {
        runCmd('launchApp', { app: appName }, null, failCallback);
    };

    var __openBizList = function (appName, failCallback) {
        runCmd('openAppMsgList', { appId: appName }, null, failCallback);
    };

    var __sendInfo = function (receiver, infoSourceId, infoSourceName, msgTitle, msgSubject, msgUrl, msgIconUrl) {
        var args = { receivers: receiver, sourceId: infoSourceId, source: infoSourceName, title: msgTitle, subject: msgSubject, url: msgUrl, iconUrl: msgIconUrl };
        runCmd('sendInfoMsg', args);
    };

    var __closeWindow = function () {
        runCmd('closeWindow');
    };

    var __maxWindow = function (successCallback) {
        runCmd('maxWindow', null, successCallback, null);
    };

    var __getSmartKeys = function (successCallback) {
        runCmd('getSmartKeys', null, successCallback, null);
    };

    var __getNetworkStatus = function (successCallback) {
        runCmd('getNetworkStatus', null, successCallback, null);
    }

    var __getWifiSSIDs = function (successCallback, failureCallback) {
        runCmd('getWifiSSIDs', null, successCallback, failureCallback);
    }

    var __getAppUUID = function (successCallback, failedCallback) {
        runCmd('getAppUUID', null, successCallback, failedCallback);
    }

    var runCmd = function (cmd, argData, successCallback, failureCallback) {

        var jsonData = argData;
        if (!jsonData)
            jsonData = { 'cmd': cmd };
        if (navigator.userAgent.match(/Android/i)) {
            var sCallback = 'null';
            if (successCallback) {
                //alert(typeof successCallback);
                if (typeof successCallback === 'function') {
                    sCallback = successCallback.name;
                    //alert(sCallback);
                } else {
                    sCallback = successCallback;
                }
            }
            var fCallback = 'null';
            if (failureCallback) {
                if (typeof failureCallback === 'function') {
                    fCallback = failureCallback.name;
                } else {
                    fCallback = failureCallback;
                }
            }
            var value = 'gocom_exec###' + cmd + '###' + encode(JSON.stringify(jsonData)) + '###' + sCallback + '###' + fCallback;
            prompt('', value);
        } else if (navigator.userAgent.match(/iPhone/i)) {
            xhr = xhr ? xhr : new XMLHttpRequest();
            xhr.open('HEAD', "/!gocom_cmd?" + (+new Date()), true);
            xhr.setRequestHeader('cmd', cmd);
            xhr.setRequestHeader('args', encode(JSON.stringify(jsonData)));
            if (successCallback) {
                if (typeof successCallback === 'function') {
                    xhr.setRequestHeader('success', successCallback.name);
                } else {
                    xhr.setRequestHeader('success', successCallback);
                }
            }
            if (failureCallback) {
                if (typeof failureCallback === 'function') {
                    xhr.setRequestHeader('fail', failureCallback.name);
                } else {
                    xhr.setRequestHeader('fail', failureCallback);
                }
            }
            xhr.send(null);
        } else if (qtCmdHandler) {
            sCallback = 'null';
            if (successCallback) {
                //alert(typeof successCallback);
                if (typeof successCallback === 'function') {
                    sCallback = successCallback.name;
                    //alert(sCallback);
                } else {
                    sCallback = successCallback;
                }
            }
            fCallback = 'null';
            if (failureCallback) {
                if (typeof failureCallback === 'function') {
                    fCallback = failureCallback.name;
                } else {
                    fCallback = failureCallback;
                }
            }
            qtCmdHandler.runCommand(cmd, JSON.stringify(jsonData), sCallback, fCallback);
        } else if (navigator.userAgent.match(/QtWebEngine/i)) {
            sCallback = 'null';
            if (successCallback) {
                //alert(typeof successCallback);
                if (typeof successCallback === 'function') {
                    sCallback = successCallback.name;
                    //alert(sCallback);
                } else {
                    sCallback = successCallback;
                }
            }
            fCallback = 'null';
            if (failureCallback) {
                if (typeof failureCallback === 'function') {
                    fCallback = failureCallback.name;
                } else {
                    fCallback = failureCallback;
                }
            }
            if (typeof runQtWebCmd === 'function') {
                runQtWebCmd(cmd, jsonData, sCallback, fCallback);
            }
        }
    };

    var runQtWebCmd = function (cmd, data, s, f) {
        //start a qt web client
        if (typeof window.qtCmdHandler !== 'undefined') {
            qtCmdHandler.runCommand(cmd, data, s, f);
        }
    };

    global.GoCom = {
        VERSION: GoCom_JS_VERSION,
        selectUser: __selectUser,
        selectUserEx: __selectUserEx,
        chatWithUser: __chatWithUser,
        showInfo: __showInfo,
        uploadFile: __uploadFile,
        getLocation: __getLocation,
        capture: __capture,
        openWindow: __openWindow,
        tdcode: __tdcode,
        launchApp: __launchApp,
        sendInfoMsg: __sendInfo,
        openAppMsgList: __openBizList,
        closeWindow: __closeWindow,
        maxWindow: __maxWindow,
        getSmartKeys: __getSmartKeys,
        getNetworkStatus: __getNetworkStatus,
        getWifiSSIDs: __getWifiSSIDs,
        getAppUUID: __getAppUUID
    };
})(this);
