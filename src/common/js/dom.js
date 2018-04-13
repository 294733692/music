// 增加class类
export function addClass(ele, className) {
    if (hasClass(ele, className)) {
        return
    }

    let newClass = ele.className.split(' ')
    newClass.push(className)
    ele.className = newClass.join(' ')
}

// 判断是否有这个类
export function hasClass(ele, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')

    return reg.test(ele.className)
}

// 获取数据
export function getData(ele, name, value) {
    const prefix = 'data-'
    name = prefix + name
    if (value) {
        return ele.setAttribute(name, value)
    }
    return ele.getAttribute(name)
}


let elementStyle = document.createElement('div').style

// 自动适配浏览器，并为其添加上前缀
let vendor = (() => {
    let transformNames = {
        webkit: "webkitTransform",
        Moz: "MozTransform",
        O: "OTransform",
        ms: "msTransform",
        standard: "transform"
    }

    for (let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key
        }
    }
    return false;
})()


export function prefixStyle(style){
    if(vendor === false){
        return false;
    }

    if(vendor === 'standard'){
        return style;
    }

    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}