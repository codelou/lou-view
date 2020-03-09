var CONFIRM_TEXT = '确定';
var CANCEL_TEXT = '取消';

var defaults = {
    title: '提示',
    message: '',
    type: '',
    showInput: false,
    showClose: true,
    modalFade: false,
    lockScroll: false,
    closeOnClickModal: true,
    inputValue: null,
    inputPlaceholder: '',
    inputPattern: null,
    inputValidator: null,
    inputErrorMessage: '',
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonPosition: 'right',
    confirmButtonHighlight: false,
    cancelButtonHighlight: false,
    confirmButtonText: CONFIRM_TEXT,
    cancelButtonText: CANCEL_TEXT,
    confirmButtonClass: '',
    cancelButtonClass: ''
};

import Vue from 'vue';
import msgboxVue from './message-box.vue';

var merge = function (target) {
    for (var i = 1, j = arguments.length; i < j; i++) {
        var source = arguments[i];
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                var value = source[prop];
                if (value !== undefined) {
                    target[prop] = value;
                }
            }
        }
    }

    return target;
};

var MessageBoxConstructor = Vue.extend(msgboxVue);

var currentMsg;
// message box（vue）实例
var instance;
var msgQueue = [];

const defaultCallback = action => {
    if (currentMsg) {
        var callback = currentMsg.callback;
        if (typeof callback === 'function') {
            if (instance.showInput) {
                callback(instance.inputValue, action);
            } else {
                callback(action);
            }
        }
        if (currentMsg.resolve) {
            var $type = currentMsg.options.$type;
            if ($type === 'confirm' || $type === 'prompt') {
                if (action === 'confirm') {
                    if (instance.showInput) {
                        currentMsg.resolve({value: instance.inputValue, action});
                    } else {
                        currentMsg.resolve(action);
                    }
                } else if (action === 'cancel' && currentMsg.reject) {
                    currentMsg.reject(action);
                }
            } else {
                currentMsg.resolve(action);
            }
        }
    }
};
// 初始化实例,一个页面里面，messagebox的实例只有一个
var initInstance = function () {
    instance = new MessageBoxConstructor({
        el: document.createElement('div')
    });

    instance.callback = defaultCallback;
};

var showNextMsg = function () {
    if (!instance) {
        initInstance();
    }
    // 如果当前没有 messagebox显示
    if (!instance.value || instance.closeTimer) {
        if (msgQueue.length > 0) {// 且有要显示的消息
            currentMsg = msgQueue.shift();
            // 往messagebox对象上设置数据
            var options = currentMsg.options;
            for (var prop in options) {
                if (options.hasOwnProperty(prop)) {
                    instance[prop] = options[prop];
                }
            }
            // callback 也会被instance中的callback 也会在上一步的循环被重置掉
            if (options.callback === undefined) {
                instance.callback = defaultCallback;
            }
            // 设置默认属性
            ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape'].forEach(prop => {
                if (instance[prop] === undefined) {
                    instance[prop] = true;
                }
            });
            document.body.appendChild(instance.$el);

            // 显示对话框
            //    Vue.nextTick(() => {
            instance.value = true;
            //  });
        }
    }
};

var MessageBox = function (options, callback) {
    if (typeof options === 'string') {// 外部直接new MessageBox来调用弹框
        options = {
            title: options
        };
        if (arguments[1]) {
            options.message = arguments[1];
        }
        if (arguments[2]) {
            options.type = arguments[2];
        }
    } else if (options.callback && !callback) {// 通过alert、confirm、prompt调用
        callback = options.callback;
    }
    // 想message queue里压入当前要显示的消息
    if (typeof Promise !== 'undefined') {// 浏览器存在promise对象
        return new Promise(function (resolve, reject) { // eslint-disable-line
            msgQueue.push({
                options: merge({}, defaults, MessageBox.defaults || {}, options),
                callback: callback,
                resolve: resolve,
                reject: reject
            });

            showNextMsg();
        });
    } else {// 浏览器不存在promise对象
        msgQueue.push({
            options: merge({}, defaults, MessageBox.defaults || {}, options),
            callback: callback
        });

        showNextMsg();
    }
};

MessageBox.setDefaults = function (defaults) {
    MessageBox.defaults = defaults;
};
// 输出提示框
MessageBox.alert = function (message, title, options) {
    if (typeof title === 'object') {
        options = title;
        title = '';
    }
    return MessageBox(merge({
        title: title,
        message: message,
        $type: 'alert',
        closeOnPressEscape: false,
        closeOnClickModal: false
    }, options));
};
// 输出确认框
MessageBox.confirm = function (message, title, options) {
    if (typeof title === 'object') {
        options = title;
        title = '';
    }
    return MessageBox(merge({
        title: title,
        message: message,
        $type: 'confirm',
        showCancelButton: true
    }, options));
};
// 弹出输入框，搜集用户数据
MessageBox.prompt = function (message, title, options) {
    if (typeof title === 'object') {
        options = title;
        title = '';
    }
    return MessageBox(merge({
        title: title,
        message: message,
        showCancelButton: true,
        showInput: true,
        $type: 'prompt'
    }, options));
};

MessageBox.close = function () {
    instance.value = false;
    msgQueue = [];
    currentMsg = null;
};

export default MessageBox;
export {MessageBox};
