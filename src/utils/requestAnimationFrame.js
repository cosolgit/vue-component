let lastTime = 0;
const prefixes = "webkit moz ms o".split(" ");

let requestAnimationFraeme, cancleAnimationFrame;

const isServer = typeof window === "undefined";

if (isServer) {
    requestAnimationFraeme = function() {
        return null;
    };
    cancleAnimationFrame = function() {
        return null;
    };
} else {
    requestAnimationFraeme = window.requestAnimationFrame;
    cancelAnimationFrame = window.cancelAnimationFrame;
    let prefix;
    for (let i = 0; i < prefixes.length; i++) {
        if (requestAnimationFrame && cancelAnimationFrame) {
            break;
        }
        prefix = prefixes[i];
        requestAnimationFraeme = requestAnimationFraeme || window[prefix + "RequestAnimationFrame"];
        cancelAnimationFrame =
            cancelAnimationFrame ||
            window[prefix + "CancelAnimationFrame"] ||
            window[prefix + "CancelRequestAnimationFrame"];
    }

    //https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    if (!window.requestAnimationFrame || !window.cancelAnimationFrame) {
        requestAnimationFraeme = function(callback) {
            const currentTime = new Date().getTime();
            //使setTimeout尽可能接近每秒60帧效果
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));

            const id = window.setTimeout(() => {
                callback(currentTime + timeToCall);
            }, timeToCall);

            lastTime = currentTime + timeToCall;
            return id;
        };
        cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}

export { requestAnimationFraeme, cancleAnimationFrame };
