/**
 * Created by tsxuehu on 16/12/29.
 */
import ElCol from './src/col';

/* istanbul ignore next */
ElCol.install = function(Vue) {
    Vue.component(ElCol.name, ElCol);
};

export default ElCol;