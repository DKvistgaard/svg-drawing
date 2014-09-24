window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

window.cancelAnimFrame = function(){
    return (
        window.cancelAnimationFrame       ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame    ||
        window.oCancelAnimationFrame      ||
        window.msCancelAnimationFrame     ||
        function(id){
            window.clearTimeout(id);
        }
    );
}();

function SVGElem(el) {
    this.el = el;
    this.timeout = 0;
    this.length = [];
    this.path = [];
    this.currentFrame = 0;
    this.totalFrames = 60;
    this.rendered = false;
    this.init();
}

SVGElem.prototype.init = function() {
    var svg = this;
    [].slice.call(svg.el.querySelectorAll('path')).forEach(function(path, i) {
        svg.path[i] = path;
        // Getting the total length of the path
        var length = svg.path[i].getTotalLength();
        svg.path[i].length = length;
        svg.path[i].style.strokeDasharray = length + ' ' + length;
        svg.path[i].style.strokeDashoffset = length;
        svg.path[i].getBoundingClientRect();
    });
};

SVGElem.prototype.render = function() {
    if (this.rendered) {
        return;
    }
    this.rendered = true;
    this.drawing();
};

SVGElem.prototype.drawing = function() {
    var svg = this,
        progress = svg.currentFrame / svg.totalFrames;
    if (progress > 1) {
        window.cancelAnimFrame(this.timeout);
    } else {
        svg.currentFrame++;
        for (var i = 0; i < svg.path.length; i++) {
            svg.path[i].style.strokeDashoffset = Math.floor(svg.path[i].length * (1 - progress));
        }
        this.timeout = window.requestAnimFrame(function() {
            svg.drawing();
        })
    }
};

function init() {
    var svgs = [].slice.call(document.querySelectorAll('.line-drawing'));
    svgs.forEach(function(el) {
        var svg = new SVGElem(el);
        svg.render();
    });
}

init();