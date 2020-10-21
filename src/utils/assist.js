//向上找到最近的指定组件
function findComponentUpward(context, componentName) {
    let parent = context.$parent;
    let name = parent.$options.name;

    while (parent && (!name || name != componentName)) {
        parent = parent.$parent;
        parent && (name = parent.$options.name);
    }
    return parent;
}

//向上找到所有指定组件
function findComponentsUpward(context, componentName) {
    let parent = context.$parent;
    let name = parent.$options.name;
    let parents = [];
    if (parent) {
        name === componentName && parents.push(parent);
        return parents.concat(findComponentsUpward(parent, componentName));
    } else {
        return [];
    }
}

//向下找到最近的指定组件(不太会)
function findComponentDownward(context, componentName) {
    let childrens = context.$children;
    let children;
    if (childrens.length) {
        for (const child of childrens) {
            let name = child.$options.name;
            if (name === componentName) {
                children = child;
                break;
            } else {
                children = findComponentDownward(child, componentName);
                if (children) break;
            }
        }
    }
    return children;
}

//向下找到所有组件
function findComponentDownward(context, componentName) {
    return context.$children.reduce((components, child) => {
        if (child.$options.name === componentName) components.push(child);
        const foundChilds = findComponentDownward(child, componentName);
        return [...components, ...foundChilds];
    }, []);
}

//找到指定组件的兄弟组件( 父组件的所有子组件)
function findBrothersComponents(context, componentName, exceptMe = true) {
    let res = context.$parent.$children.filter(item => item.$options.name === componentName);
    //_uid每个组件独一无二的
    let index = res.findIndex(item => item._uid === context._uid);
    exceptMe && res.splice(index, 1);

    return res;
}
