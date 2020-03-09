/**
 * Created by tsxuehu on 16/12/29.
 */
import ElInputNumber from './src/input-number';

/* istanbul ignore next */
ElInputNumber.install = function(Vue) {
    Vue.component(ElInputNumber.name, ElInputNumber);
};

export default ElInputNumber;