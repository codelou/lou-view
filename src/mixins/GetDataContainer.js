/**
 * Created by tsxuehu on 16/12/28.
 * TODO 提供用户修改数据的代理工具，代理工具会打日志，生成用户点击的漏斗模型，促进业务的改善
 */
export default {
    methods: {
        getDataContainer() {
            var parent = this.$parent;
            while (parent && (!parent['$isDataContainer'])) {
                parent = parent.$parent;
            }
            return parent
        }
    }
};