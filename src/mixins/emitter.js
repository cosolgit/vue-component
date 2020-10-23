export default {
    methods: {
        broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params);
        },
        dispatch(componentName, eventName, params) {
            let parent = this.$parent;
            let name = parent.$options.name;
            while (parent && (!name || name != componentName)) {
                parent = parent.$parent && (name = parent.$options.name);
            }
            parent && parent.$emit.apply(parent, [eventName].concat(params));
        },
    },
};
function broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
        let name = child.$options.name;

        name === componentName
            ? child.$emit.apply(child, [eventName].concat(params))
            : broadcast.call(child, componentName, eventName, params);
    });
}
