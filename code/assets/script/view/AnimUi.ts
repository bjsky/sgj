import UIBase from "../component/UIBase";
import { UI } from "../core/UIManager";
import { NET } from "../core/net/NetController";
import MsgSlotWin from "../message/MsgSlotWin";
import { Common } from "../CommonData";
import { EVENT } from "../core/EventController";
import GameEvent from "../GameEvent";
import LoadSprite from "../component/LoadSprite";
import PathUtil from "../utils/PathUtil";

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

export enum SlotResultAniEnum{
    None = 1,
    Repeat = 2,
    Hevart,
    Expfly,
}
export class SlotResultAnim{

    constructor(type:SlotResultAniEnum){
        this.type = type;
    }
    public type:SlotResultAniEnum;

    public muti:number =0;
    public addGold:number = 0;
    public flyCoin:number =0;
    public starTo:cc.Vec2 = null;
    public starFrom:cc.Vec2 = null;
    public coinTo:cc.Vec2 = null;
}
@ccclass
export default class AnimUi extends UIBase {

    @property(cc.Sprite)  sprRepeat: cc.Sprite = null;
    @property(cc.Node)  sprNode: cc.Node = null;
    @property(cc.Node)  nodeMuti: cc.Node = null;
    @property(cc.Label)  labelMuti: cc.Label = null;
    @property(cc.Node)  msStar: cc.Node = null;
    @property(cc.Node)  coinNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.showNothing();
    }

    private _anim:SlotResultAnim = null;
    public setData(data:any){
        super.setData(data);
        this._anim = data.anim;
    }

    start () {

    }

    onEnable(){

        this.showNothing();
        if(this._anim.type == SlotResultAniEnum.Repeat){
            this.sprRepeat.node.active = true;
            this.showAnim();
        }else if(this._anim.type == SlotResultAniEnum.Hevart){
            this.nodeMuti.active = true;
            this.labelMuti.string = this._anim.muti.toString();
            this.showAnim();
        }else if(this._anim.type == SlotResultAniEnum.Expfly){
            this.msStar.active = true;
            var moveFrom:cc.Vec2 = this.msStar.parent.convertToNodeSpaceAR(this._anim.starFrom);
            var moveTo:cc.Vec2 = this.msStar.parent.convertToNodeSpaceAR(this._anim.starTo);

            var moveCenter:cc.Vec2 = cc.v2(moveFrom.x+100,moveFrom.y+100);
            this.msStar.position = moveFrom;
            var move = cc.sequence(cc.bezierTo(0.6,[moveFrom,moveCenter,moveTo]).easing(cc.easeIn(1.5)),
                cc.callFunc(()=>{
                    this.msStar.active = false;
                    EVENT.emit(GameEvent.Show_Exp_FlyEnd);
                }));
            this.msStar.runAction(move);
        }
    }
    onDisable(){

    }

    private showNothing(){
        this.sprRepeat.node.active = false;
        this.nodeMuti.active = false;
        this.msStar.active = false;
    }

    private showAnim(){
        this.sprNode.scale = 0.7;
        this.sprNode.opacity = 255;
        var seqOut = cc.sequence(cc.scaleTo(0.15,1).easing(cc.easeBackOut()),
            cc.delayTime(0.6),
            cc.callFunc(()=>{
                if(this._anim.type == SlotResultAniEnum.Hevart){
                    this.showCoinFly(this._anim.flyCoin);
                }
            }),
            cc.fadeOut(0.5),
            cc.callFunc(()=>{
                if(this._anim.type == SlotResultAniEnum.Repeat){
                    UI.removeUI(this.node)
                }
            }));
        this.sprNode.runAction(seqOut);

        NET.send(MsgSlotWin.create(this._anim.addGold),(msg:MsgSlotWin)=>{
            if(msg && msg.resp){
                Common.gold = msg.resp.gold;
            }
        },this)
    }

    private showCoinFly(flycount:number){
        this.clearCoins();
        for(var i:number = 0;i<flycount;i++){
            var coin:cc.Node = this._coinPool.get();
            if(!coin){
                coin = new cc.Node();
                var spr:LoadSprite = coin.addComponent(LoadSprite);
                spr.load(PathUtil.getCoinUrl());
            }
            
            var req = cc.sequence(cc.scaleTo(0.1,-1,1),cc.scaleTo(0.2,1,1)).repeatForever();
            coin.runAction(req);
            coin.parent = this.coinNode;
            coin.position = this.randomPos();
            var moveTo:cc.Vec2 = coin.parent.convertToNodeSpaceAR(this._anim.coinTo);
            var flyMotion = cc.sequence(cc.fadeIn(0.1),cc.moveTo(0.4,moveTo).easing(cc.easeIn(1.5)));
            coin.runAction(flyMotion);
            this._coins.push(coin);
        }
        this.scheduleOnce(()=>{
            this.clearCoins();
            UI.removeUI(this.node)
            EVENT.emit(GameEvent.Show_Gold_Fly);
        },0.5)
    }
    private randomPos():cc.Vec2{
        var center:cc.Vec2 = cc.v2(0,0);
        var x= center.x+(Math.random()-0.5)* 300;
        var y= center.y+(Math.random()-0.5)* 100;
        console.log("coin pos:"+x,y);
        return cc.v2(x,y);
    }

    private _coins:cc.Node[] = [];
    private _coinPool:cc.NodePool = new cc.NodePool();
    private clearCoins(){
        while(this._coins.length>0){
            var coin:cc.Node = this._coins.shift();
            coin.stopAllActions();
            this._coinPool.put(coin);
        }
    }

    // update (dt) {}
}
