<template>
  <div class="visual-swipe-item">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'vv-swipe-item',

    mounted() {
      this.$parent && this.$parent.swipeItemCreated(this);
    },

    destroyed() {
      this.$parent && this.$parent.swipeItemDestroyed(this);
    }
  };
</script>
