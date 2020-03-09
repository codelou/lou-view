<template>
    <div class="visual-bottom">
        <slot>
            底部容器
        </slot>
    </div>
</template>

<script>
    /**
     * mt-header
     * @module components/header
     * @desc 顶部导航
     * @param {boolean} [fixed=false] - 固定顶部
     * @param {string} [title] - 标题
     * @param {slot} [left] - 显示在左侧区域
     * @param {slot} [right] - 显示在右侧区域
     *
     */
    export default {
        name: 'vv-bottom',
    };
</script>

