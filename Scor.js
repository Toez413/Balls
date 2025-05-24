"use strict";

function Score(position){
    this.position = position;
    this.origin = new Vector2(47,82);
    this.value = 0;
    this.width = 54;
}

Score.prototype.reset = function(){
    this.value = 0;
};

Score.prototype.draw = function () {
    Canvas2D.drawText(
        this.value,
        this.position,
        this.origin,
        "#096834",
        "top",
        "Impact",
        "200px"
    );
};

Score.prototype.drawLines = function (color) {
    for(let i = 0; i < this.value; i++) {
        Canvas2D.drawText(
            "I",
            this.position.add(new Vector2(i * 15, 0)),
            this.origin,
            color,
            "top",
            "Arial",
            "20px"
        );
    }
};

Score.prototype.increment = function(){
    this.value++;
};