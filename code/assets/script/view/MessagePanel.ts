import PopUpBase from "../component/PopUpBase";
import ButtonEffect from "../component/ButtonEffect";
import { CFG } from "../core/ConfigManager";
import { ConfigConst } from "../GlobalData";
import { EVENT } from "../core/EventController";
import GameEvent from "../GameEvent";

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
export enum MessagePanelType{
    gotoSlot = 1,
}

@ccclass
export default class MessagePanel extends PopUpBase {

    @property(cc.RichText) content: cc.RichText = null;
    @property(cc.Button) btnToSlot: cc.Button = null;
    @property(cc.Node) toSlotNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.content.string ='';
        this.toSlotNode.active = false;
    }

    private _type:MessagePanelType = 0;
    public setData(data:any){
        this._type = data.type;
    }

    onEnable(){
        super.onEnable();
        this.btnToSlot.node.on(ButtonEffect.CLICK_END,this.toSlotTouch,this);
        this._sure = false;
    }
    onDisable(){
        super.onDisable();
        this.btnToSlot.node.off(ButtonEffect.CLICK_END,this.toSlotTouch,this);
    }
    protected onShowComplete(){
        if(this._type == MessagePanelType.gotoSlot){
            this.toSlotNode.active = true;
            this.content.string = "<color=#f6ff00><b>金币不足！</b></c>";
            this.content.fontSize = 50;
            this.content.lineHeight = 60;
        }
    }

    private _sure:boolean = false;
    private toSlotTouch(e){
        //去转盘
        this._sure = true;
        this.onClose(e);
    }

    protected onCloseComplete(){
        if(this._sure){
            EVENT.emit(GameEvent.Scene_To_Slot);
        }
        super.onCloseComplete();
    }
    start () {

    }

    // update (dt) {}
}
