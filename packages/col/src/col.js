export default {
    name: 'O2Col',

    props: {
        span: {
            type: Number,
            default: 24
        },
        offset: Number,
        pull: Number,
        push: Number,
        xs: [Number, Object],
        sm: [Number, Object],
        md: [Number, Object],
        lg: [Number, Object]
    },

    computed: {
        gutter() {
            return this.$parent.gutter;
        },

        style() {
            var ret = {};

            if (this.gutter) {
                ret.paddingLeft = this.gutter / 2 + 'px';
                ret.paddingRight = ret.paddingLeft;
            }

            return ret;
        }
    },
    render(createElement) {
        let {style} = this;
        let classList = ['el-col'];

        ['span', 'offset', 'pull', 'push'].forEach(prop => {
            if (this[prop]) {
                classList.push(
                    prop !== 'span'
                        ? `el-col-${prop}-${this[prop]}`
                        : `el-col-${this[prop]}`
                );
            }
        });

        ['xs', 'sm', 'md', 'lg'].forEach(size => {
            if (typeof this[size] === 'number') {
                classList.push(`el-col-${size}-${this[size]}`);
            } else if (typeof this[size] === 'object') {
                let props = this[size];
                Object.keys(props).forEach(prop => {
                    classList.push(
                        prop !== 'span'
                            ? `el-col-${size}-${prop}-${props[prop]}`
                            : `el-col-${size}-${props[prop]}`
                    );
                });
            }
        });
        return createElement('div', {'class': classList, 'style': style}, this.$slots.default);

    }
};