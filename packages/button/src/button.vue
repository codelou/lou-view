<template>
    <button :disabled="disabled" class="visual-button"
            @click="handleClick"
            :autofocus="autofocus"
            :type="nativeType"
            :class="[
      type ? 'visual-button--' + type : '',
      size ? 'visual-button--' + size : '',
      {
        'is-disabled': disabled,
        'is-plain': plain
      },
      extClass
    ]">
        <span class="visual-button-icon" v-if="icon">
            <i class="visual-icon" :class="'visual-icon-' + icon"></i>
        </span>

        <span v-if="$slots.default">
            <slot>
            </slot>
        </span>
        <span v-if="!$slots.default && !icon">
            Button
        </span>
    </button>
</template>

<script>


    /**
     * vv-header
     * @module components/button
     * @desc 按钮
     * @param {string} [type=default] - 显示类型，接受 default, primary, danger
     * @param {boolean} [disabled=false] - 禁用
     * @param {boolean} [plain=false] - 幽灵按钮
     * @param {string} [size=normal] - 尺寸，接受 normal, small, large
     * @param {string} [native-type] - 原生 type 属性
     * @param {string} [icon] - 图标，提供 more, back，或者自定义的图标（传入不带前缀的图标类名，最后拼接成 .oxygenui-xxx）
     * @param {slot} - 显示文本
     * @param {slot} [icon] 显示图标
     *
     * @example
     * <vv-button size="large" icon="back" type="primary">按钮</vv-button>
     */
    export default {
        name: 'vv-button',

        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        },

        props: {
            type: {
                type: String,
                default: 'default'
            },
            size: {
                type: String,
                default: 'normal'
            },
            icon: {
                type: String,
                default: ''
            },
            nativeType: {
                type: String,
                default: 'button'
            },
            extClass: String,
            disabled: Boolean,
            plain: Boolean,
            autofocus: Boolean
        }
    };


</script>

