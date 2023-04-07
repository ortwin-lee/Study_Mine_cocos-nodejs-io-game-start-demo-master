import { _decorator, Component, EventTouch, Input, input, Node, UITransform, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoyStickManager')
export class JoyStickManager extends Component {
    public input: Vec2 = Vec2.ZERO;

    private _body:Node;
    private _stick:Node;
    private _radius: number;

    onLoad () {
        this._body = this.node.getChildByName("Body");
        this._stick = this._body.getChildByName("Stick");
        this._radius = this._body.getComponent(UITransform).width / 2;
        this._body.active = false;
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy () {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const touchPos = event.getUILocation();
        this._body.setPosition(touchPos.x, touchPos.y);
        this._body.active = true;
    }

    private onTouchMove(event: EventTouch) {
        const touchPos = event.getUILocation();
        const stickPos = new Vec2(touchPos.x - this._body.position.x, touchPos.y - this._body.position.y);
        if(stickPos.length() > this._radius) {
            stickPos.multiplyScalar(this._radius / stickPos.length());
        }
        this._stick.setPosition(stickPos.x, stickPos.y);

        this.input = stickPos.clone().normalize();
    }

    onTouchEnd(event: EventTouch) {
        this._body.active = false;
        this._stick.setPosition(0,0);
        this.input = Vec2.ZERO;
    }
}

