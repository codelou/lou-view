<template>
  <a class="visual-cell" :href="href">
    <span class="visual-cell-mask" v-if="isLink"></span>
    <div class="visual-cell-left">
      <slot name="left"></slot>
    </div>
    <div class="visual-cell-wrapper">
      <div class="visual-cell-title">
        <slot name="icon">
          <i v-if="icon" class="visual-icon" :class="'visual-icon-' + icon"></i>
        </slot>
        <slot name="title">
          <span class="visual-cell-text" v-text="title"></span>
          <span v-if="label" class="visual-cell-label" v-text="label"></span>
        </slot>
      </div>
      <div class="visual-cell-value" :class="{ 'is-link' : isLink }"  @click="$emit('click')">
        <slot>
          <span v-text="value"></span>
        </slot>
      </div>
    </div>
    <div class="visual-cell-right">
      <slot name="right"></slot>
    </div>
    <i v-if="isLink || showArray"  @click="$emit('click')" class="visual-cell-allow-right"></i>
  </a>
</template>

<script>
/**
 * vv-cell
 * @module components/cell
 * @desc 单元格
 * @param {string|Object} [to] - 跳转链接，使用 vue-router 的情况下 to 会传递给 router.push，否则作为 a 标签的 href 属性处理
 * @param {string} [icon] - 图标，提供 more, back，或者自定义的图标（传入不带前缀的图标类名，最后拼接成 .oxygenui-xxx）
 * @param {string} [title] - 标题
 * @param {string} [label] - 备注信息
 * @param {boolean} [is-link=false] - 可点击的链接
 * @param {string} [value] - 右侧显示文字
 * @param {slot} - 同 value, 会覆盖 value 属性
 * @param {slot} [title] - 同 title, 会覆盖 title 属性
 * @param {slot} [icon] - 同 icon, 会覆盖 icon 属性，例如可以传入图片
 *
 * @example
 * <vv-cell title="标题文字" icon="back" is-link value="描述文字"></vv-cell>
 * <vv-cell title="标题文字" icon="back">
 *   <div slot="value">描述文字啊哈</div>
 * </vv-cell>
 */
export default {
  name: 'vv-cell',

  props: {
    to: [String, Object],
    icon: String,
    title: String,
    label: String,
    isLink: Boolean,
    value: {},
    showArray:Boolean
  },

  computed: {
    href() {
      if (this.to && !this.added && this.$router) {
        const resolved = this.$router.match(this.to);
        if (!resolved.matched.length) return this.to;

        this.$nextTick(() => {
          this.added = true;
          this.$el.addEventListener('click', this.handleClick);
        });
        return resolved.path;
      }
      return this.to;
    }
  },

  methods: {
    handleClick($event) {
      $event.preventDefault();
      this.$router.push(this.href);
    }
  }
};
</script>
