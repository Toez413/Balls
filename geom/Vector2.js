"use strict";

function Vector2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Object.defineProperty(Vector2, "zero", {
    get: function () { return new Vector2(0, 0); }
});

Object.defineProperty(Vector2.prototype, "isZero", {
    get: function () { return this.x === 0 && this.y === 0; }
});

Object.defineProperty(Vector2.prototype, "length", {
    get: function () { return Math.sqrt(this.x * this.x + this.y * this.y); }
});

Vector2.prototype.addTo = function (v) {
    if (v instanceof Vector2) {
        this.x += v.x;
        this.y += v.y;
    } else if (typeof v === "number") {
        this.x += v;
        this.y += v;
    }
    return this;
};

Vector2.prototype.add = function (v) {
    return this.copy().addTo(v);
};

Vector2.prototype.subtractFrom = function (v) {
    if (v instanceof Vector2) {
        this.x -= v.x;
        this.y -= v.y;
    } else if (typeof v === "number") {
        this.x -= v;
        this.y -= v;
    }
    return this;
};

Vector2.prototype.subtract = function (v) {
    return this.copy().subtractFrom(v);
};

Vector2.prototype.divideBy = function (v) {
    if (v instanceof Vector2) {
        this.x /= v.x;
        this.y /= v.y;
    } else if (typeof v === "number") {
        this.x /= v;
        this.y /= v;
    }
    return this;
};

Vector2.prototype.divide = function (v) {
    return this.copy().divideBy(v);
};

Vector2.prototype.multiplyWith = function (v) {
    if (v instanceof Vector2) {
        this.x *= v.x;
        this.y *= v.y;
    } else if (typeof v === "number") {
        this.x *= v;
        this.y *= v;
    }
    return this;
};

Vector2.prototype.multiply = function (v) {
    return this.copy().multiplyWith(v);
};

Vector2.prototype.toString = function () {
    return `(${this.x}, ${this.y})`;
};

Vector2.prototype.normalize = function () {
    var len = this.length;
    if (len !== 0) this.divideBy(len);
    return this;
};

Vector2.prototype.copy = function () {
    return new Vector2(this.x, this.y);
};

Vector2.prototype.equals = function (obj) {
    return this.x === obj.x && this.y === obj.y;
};

Vector2.prototype.distanceFrom = function (obj) {
    var dx = this.x - obj.x, dy = this.y - obj.y;
    return Math.sqrt(dx * dx + dy * dy);
};