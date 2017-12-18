import * as createjs from 'createjs-module';

export class Leg {
    id: number;
    x: number;
    y: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    nodes: any;
    onClick: Function;
    circle: createjs.Shape;
    rect: createjs.Shape;
    line: createjs.Shape;

    constructor(id: number,public startText, public endText) {
        this.id = id;
        this.nodes = {};
    }

    public createShapes(stage: createjs.Stage) {
        this.circle = new createjs.Shape();
        this.circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 15);
       
        this.rect = new createjs.Shape();
        this.rect.graphics.beginFill('lightgreen').drawRect(-15, -10, 30, 20);

        this.line = new createjs.Shape();

        stage.addChild(this.line);
        stage.addChild(this.circle);
        stage.addChild(this.rect);

        this.circle.addEventListener('click', ()=> {
            // alert(this.startText + this.endText);
            if(this.onClick) {
                this.onClick(this.id);
            }
        });
    }

    moveTo(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.startX = this.x;
        this.startY = this.y + 350;
        this.endX = this.x;
        this.endY = this.y;

        this.circle.x = this.startX;
        this.circle.y = this.startY;
        this.rect.x = this.endX;
        this.rect.y = this.endY;
        this.line.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)");
        this.line.graphics.moveTo(this.startX, this.startY);
        this.line.graphics.lineTo(this.endX, this.endY);
        this.line.graphics.endStroke();
    }
}