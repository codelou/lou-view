<template>
    <div class="el-input-number"
         :class="[
      size ? 'el-input-number--' + size : '',
      { 'is-disabled': disabled },
      { 'is-without-controls': !controls}
    ]">
    <span
            v-if="controls"
            class="el-input-number__decrease el-icon-minus"
            :class="{'is-disabled': minDisabled}"
            v-repeat-click="decrease">
        -
    </span>
        <span
                v-if="controls"
                class="el-input-number__increase el-icon-plus"
                :class="{'is-disabled': maxDisabled}"
                v-repeat-click="increase">
            +
        </span>
        <span>
        {{currentValue}}
        </span>
    </div>
</template>
<script>
    /**
     * 增加callback，达到最大、最小值得时候调用callback
     */
    import {once, on} from 'components/wind-dom/event';
    export default {
        name: 'O2InputNumber',
        directives: {
            repeatClick: {
                bind(el, binding, vnode) {
                    let interval = null;
                    let startTime;
                    const handler = () => {
                        vnode.context[binding.expression]();
                    };
                    const clear = function () {
                        if (new Date() - startTime < 100) {
                            handler();
                        }
                        clearInterval(interval);
                        interval = null;
                    };
                    on(el, 'mousedown', function () {
                        startTime = new Date();
                        once(document, 'mouseup', clear);
                        interval = setInterval(function () {
                            handler();
                        }, 100);
                    });
                }
            }
        },

        props: {
            // 步进
            step: {
                type: Number,
                default: 1
            },
            // 最大值
            max: {
                type: Number,
                default: Infinity
            },
            // 最小值
            min: {
                type: Number,
                default: 0
            },
            // model
            value: {
                default: 0
            },
            // 是否禁用
            disabled: Boolean,
            // 尺寸大小
            size: String,
            // 是否使用控制按钮
            controls: {
                type: Boolean,
                default: true
            }
        },
        data() {
            // 纠正初始数据
            let value = this.value;
            if (value < this.min) {
                this.$emit('input', this.min);
                value = this.min;
            }
            if (value > this.max) {
                this.$emit('input', this.max);
                value = this.max;
            }
            return {
                currentValue: value
            };
        },
        watch: {
            value(val) {
                this.currentValue = val;
            },
            currentValue(newVal, oldVal) {
                if (newVal <= this.max && newVal >= this.min) {
                    this.$emit('change', newVal, oldVal);
                    this.$emit('input', newVal);
                }
            }
        },
        computed: {
            minDisabled() {
                return this.accSub(this.value, this.step) < this.min;
            },
            maxDisabled() {
                return this.accAdd(this.value, this.step) > this.max;
            }
        },
        methods: {
            // arg1 减 arg2
            accSub(arg1, arg2) {
                var r1, r2, m, n;
                try {
                    // 小数位数
                    r1 = arg1.toString().split('.')[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    // 小数位数
                    r2 = arg2.toString().split('.')[1].length;
                } catch (e) {
                    r2 = 0;
                }
                // 转化成整数运算的基数
                m = Math.pow(10, Math.max(r1, r2));
                // 最大小数位数
                n = (r1 >= r2) ? r1 : r2;
                // 转化成整数运算，然后在转成小数。。最后在fix到指定位数
                return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(n));
            },
            // arg1 加 arg2
            accAdd(arg1, arg2) {
                var r1, r2, m, c;
                try {
                    // 小数位数
                    r1 = arg1.toString().split('.')[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    // 小数位数
                    r2 = arg2.toString().split('.')[1].length;
                } catch (e) {
                    r2 = 0;
                }
                // 小数位数的差值
                c = Math.abs(r1 - r2);
                // 转成整数运算所需的基数
                m = Math.pow(10, Math.max(r1, r2));
                if (c > 0) {
                    var cm = Math.pow(10, c);
                    if (r1 > r2) {
                        arg1 = Number(arg1.toString().replace('.', ''));
                        arg2 = Number(arg2.toString().replace('.', '')) * cm;
                    } else {
                        arg1 = Number(arg1.toString().replace('.', '')) * cm;
                        arg2 = Number(arg2.toString().replace('.', ''));
                    }
                } else {
                    arg1 = Number(arg1.toString().replace('.', ''));
                    arg2 = Number(arg2.toString().replace('.', ''));
                }
                return (arg1 + arg2) / m;
            },
            // 步进
            increase() {
                if (this.maxDisabled) return;
                const value = this.value || 0;
                if (this.accAdd(value, this.step) > this.max || this.disabled) return;
                this.currentValue = this.accAdd(value, this.step);
            },
            // 步退
            decrease() {
                if (this.minDisabled) return;
                const value = this.value || 0;
                if (this.accSub(value, this.step) < this.min || this.disabled) return;
                this.currentValue = this.accSub(value, this.step);
            }
        }
    };
</script>

