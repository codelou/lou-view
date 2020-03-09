<template>
  <x-cell
    class="visual-field"
    @click="$emit('click')"
    :title="label"
    :showArray = "showArray"
    v-clickoutside="doCloseActive"
    :class="[{
      'is-textarea': type === 'textarea',
      'is-nolabel': !label
    }]">
    <textarea
      @change="$emit('change', currentValue)"
      ref="textarea"
      class="visual-field-core"
      :placeholder="placeholder"
      v-if="type === 'textarea'"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      v-model="currentValue">
    </textarea>
    <div class="visual-field-custom" v-else-if="type === 'custom'">
        <slot name="value">
          自定义内容
        </slot>
    </div>
    <input
      @change="$emit('change', currentValue)"
      ref="input"
      class="visual-field-core"
      :placeholder="placeholder"
      :number="type === 'number'"
      v-else
      :type="type"
      @focus="active = true"
      :disabled="disabled"
      :readonly="readonly"
      :value="currentValue"
      @input="handleInput">
    <div
      @click="handleClear"
      class="visual-field-clear"
      v-if="!disableClear"
      v-show="currentValue && type !== 'textarea' && active">
      <i class="oxygenui oxygenui-field-error"></i>
    </div>
    <span class="visual-field-state" v-if="state" :class="['is-' + state]">
      <i class="oxygenui" :class="['oxygenui-field-' + state]"></i>
    </span>
    <div class="visual-field-other">
      <slot></slot>
    </div>
  </x-cell>
</template>

<script>
import XCell from '../../cell/index.js';
import Clickoutside from '@/utils/clickoutside';

/**
 * vv-field
 * @desc 编辑器，依赖 cell
 * @module components/field
 *
 * @param {string} [type=text] - field 类型，接受 text, textarea 等
 * @param {string} [label] - 标签
 * @param {string} [rows] - textarea 的 rows
 * @param {string} [placeholder] - placeholder
 * @param {string} [disabled] - disabled
 * @param {string} [readonly] - readonly
 * @param {string} [state] - 表单校验状态样式，接受 error, warning, success
 *
 * @example
 * <vv-field v-model="value" label="用户名"></vv-field>
 * <vv-field v-model="value" label="密码" placeholder="请输入密码"></vv-field>
 * <vv-field v-model="value" label="自我介绍" placeholder="自我介绍" type="textarea" rows="4"></vv-field>
 * <vv-field v-model="value" label="邮箱" placeholder="成功状态" state="success"></vv-field>
 */
export default {
  name: 'vv-field',

  data() {
    return {
      active: false,
      currentValue: this.value
    };
  },

  directives: {
    Clickoutside
  },

  props: {
    type: {
      type: String,
      default: 'text'
    },
    rows: String,
    label: String,
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean,
    disableClear: Boolean,
    state: {
      type: String,
      default: 'default'
    },
    value: {},
    attr: Object,
      showArray:Boolean
  },

  components: { XCell },

  methods: {
    doCloseActive() {
      this.active = false;
    },

    handleInput(evt) {
      this.currentValue = evt.target.value;
    },

    handleClear() {
      if (this.disabled || this.readonly) return;
      this.currentValue = '';
    }
  },

  watch: {
    value(val) {
      this.currentValue = val;
    },

    currentValue(val) {
      this.$emit('input', val);
    },

    attr: {
      immediate: true,
      handler(attrs) {
        this.$nextTick(() => {
          const target = [this.$refs.input, this.$refs.textarea];
          target.forEach(el => {
            if (!el || !attrs) return;
            Object.keys(attrs).map(name => el.setAttribute(name, attrs[name]));
          });
        });
      }
    }
  }
};
</script>

