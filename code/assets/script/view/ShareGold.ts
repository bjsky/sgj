import PopUpBase from "../component/PopUpBase";
import ButtonEffect from "../component/ButtonEffect";
import { Share } from "../ShareController";
import { UI } from "../core/UIManager";
import { Common } from "../CommonData";

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

@ccclass
export default class ShareGold extends PopUpBase{

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Label) lblDesc:cc.Label = null;
    @property(cc.RichText) lblCoin:cc.RichText = null;
    @property(cc.Button) btnShare:cc.Button = null;
    
    // onLoad () {}

    private _muti:number = 0;
    private _addGold:number = 0;
    public setData(data:any){
        super.setData(data);
        this._muti = data.muti;
        this._addGold = data.addGold;
    }

    onEnable()
    {
        super.onEnable();
        this.btnShare.node.on(ButtonEffect.CLICK_END,this.onShare,this);
        this.initView();
    }

    onDisable(){
        super.onDisable();
        this.btnShare.node.off(ButtonEffect.CLICK_END,this.onShare,this);
    }

    private initView(){
        this.lblCoin.string = "<color=#f6ff00><b>"+this._addGold+"</c>";
        this.lblDesc.string = "分享好友立即获得\n"+this._muti+"倍奖励！";
    }
    start () {

    }

    private onShare(e){
        Share.shareAppMessage(()=>{
            Share.shareGetGold(this._addGold);
        },()=>{
            UI.showTip("分享失败!");
        });
        this.onClose(e);
    }

    // update (dt) {}
}
