// 引入包
import button from "../packages/button/index.js"
import field from "../packages/field/index.js"
import cell from "../packages/cell/index.js"
import header from "../packages/header/index.js"
import bottom from "../packages/bottom/index.js"
import popup from "../packages/popup/index.js"
import toast from "../packages/toast/index.js"
import indicator from "../packages/indicator/index.js"
import messageBox from "../packages/message-box/index.js"

import '../src/assets/font/iconfont.css';
import './index.pcss';

const install = function(Vue) {
    if (install.installed) return;
    Vue.component(button.name, button);
    Vue.component(field.name, field);
    Vue.component(cell.name, cell);
    Vue.component(header.name, header);
    Vue.component(bottom.name, bottom);
    Vue.component(popup.name, popup);
    Vue.$toast = Vue.prototype.$toast = toast;
    Vue.$indicator = Vue.prototype.$indicator = indicator;
    Vue.$messageBox = Vue.prototype.$messageBox = messageBox;

};
// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
};
require('es6-promise').polyfill();
export default {
    install
};
