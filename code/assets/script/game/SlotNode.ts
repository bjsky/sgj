// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export enum SlotStateEnum{
    Idle = 1,
    Fast = 2,
    SlowBegin,
    Slow,
}
@ccclass
export default class SlotNode extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    private _fruitNode:cc.Node[] = [];
    private _fruitIds:number[] = [1,2,3,4,5,6,7,8,9];

    public initFruit(){
        this.node.children.forEach((child:cc.Node)=>{
            this._fruitNode.push(child);
        })
    }

    private _state :SlotStateEnum = SlotStateEnum.Idle;
    private _toId:number = 0;
    public play(id:number){
        this._toId = id;
        this._state = SlotStateEnum.Fast;
        this.scheduleOnce(()=>{
            this._state = SlotStateEnum.SlowBegin;
        },1.4);

    }

    private _speed:number = 800;
    update (dt) {
        if(this._state == SlotStateEnum.Fast){
            var angleF:number = dt*this._speed;
            this.node.rotation+=angleF;
            this._fruitNode.forEach((fruit:cc.Node)=>{
                fruit.rotation = -this.node.rotation;
            })
        }
        else if(this._state == SlotStateEnum.SlowBegin){
            this.node.stopAllActions();
            var toIndex:number = this._fruitIds.indexOf(this._toId);
            var fromIndex:number = toIndex + 5;
            // if(fromIndex<0){
            //     fromIndex+=this._fruitIds.length;
            // }
            var fromAngle:number = fromIndex * -40;
            this.node.rotation = fromAngle;
            this.node.runAction(cc.sequence(cc.rotateBy(0.6,5*40).easing(cc.easeOut(1.8)),cc.callFunc(()=>{
                this._state = SlotStateEnum.Idle;
            })))
            this._state = SlotStateEnum.Slow;
        }else if(this._state == SlotStateEnum.Slow){
            this._fruitNode.forEach((fruit:cc.Node)=>{
                fruit.rotation = -this.node.rotation;
            })
        }

    }
}
