/**
 * Created by tsxuehu on 16/12/29.
 */
import Row from './src/row';

/* istanbul ignore next */
Row.install = function(Vue) {
    Vue.component(Row.name, Row);
};

export default Row;