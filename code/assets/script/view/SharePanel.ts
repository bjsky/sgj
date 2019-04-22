import PopUpBase from "../component/PopUpBase";
import ButtonEffect from "../component/ButtonEffect";
import { Share } from "../ShareController";
import { UI } from "../core/UIManager";
import { Common } from "../CommonData";
import { CFG } from "../core/ConfigManager";
import { ConfigConst } from "../GlobalData";
import { Scene } from "../scene/SceneController";
import { SceneEnum } from "../scene/SceneBase";
import FarmScene from "../scene/FarmScene";
import GameScene from "../scene/GameScene";

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
export enum ShareType{
    shareGetGold,       //分享得金币
    shareGetEnergy,     //分享得精力
    shareGetWater,      //分享得水滴
}
@ccclass
export default class SharePanel extends PopUpBase{

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Label) lblDesc:cc.Label = null;
    @property(cc.RichText) lblCoin:cc.RichText = null;
    @property(cc.Button) btnShare:cc.Button = null;
    @property(cc.Node) iconCoin:cc.Node = null;
    @property(cc.Node) iconStar:cc.Node = null;
    @property(cc.Node) iconWater:cc.Node = null;
    
    // onLoad () {}

    private _muti:number = 0;
    private _addGold:number = 0;
    private _type:ShareType = 0;
    private _addEnergy:number = 0;
    private _addWater:number = 0;
    public setData(data:any){
        super.setData(data);
        this._type = data.type;
        if(this._type == ShareType.shareGetGold){
            this._muti = data.muti;
            this._addGold = data.addGold;
        }else if(this._type == ShareType.shareGetEnergy){
            this._addEnergy = Number(CFG.getCfgByKey(ConfigConst.Constant,"key","shareEnergy")[0].value)
        }else if(this._type == ShareType.shareGetWater){
            this._addWater = Number(CFG.getCfgByKey(ConfigConst.Constant,"key","shareWater")[0].value)
        }
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
        this.iconCoin.active = (this._type == ShareType.shareGetGold);
        this.iconStar.active = (this._type == ShareType.shareGetEnergy);
        this.iconWater.active = (this._type == ShareType.shareGetWater);
        if(this._type == ShareType.shareGetGold){
            this.lblCoin.string = "<color=#f6ff00><b>"+this._addGold+"</c>";
            this.lblDesc.string = "分享好友立即获得\n"+this._muti+"倍奖励！";
        }else if(this._type == ShareType.shareGetEnergy){
            this.lblDesc.string = "分享好友立即获得精力:";
            this.lblCoin.string = "<color=#f6ff00><b>"+this._addEnergy+"</c>";
        }else if(this._type == ShareType.shareGetWater){
            this.lblDesc.string = "分享好友立即获得水滴:";
            this.lblCoin.string = "<color=#f6ff00><b>"+this._addWater+"</c>";
        }
    }
    start () {

    }

    private onShare(e){
        var btnFrom:cc.Vec2 = this.btnShare.node.parent.convertToWorldSpaceAR(this.btnShare.node.position);
        var scene = Scene.getCurScene();
        var btnTo:cc.Vec2;
        if(scene.sceneName == SceneEnum.Farm){
            var iconWater = (scene as FarmScene).iconWater;
            btnTo = iconWater.parent.convertToWorldSpaceAR(iconWater.position);
        }else if(scene.sceneName == SceneEnum.Game){
            var iconEnergy = (scene as GameScene).iconEnergy;
            btnTo = iconEnergy.parent.convertToWorldSpaceAR(iconEnergy.position);
        }
        Share.shareAppMessage(()=>{
            if(this._type == ShareType.shareGetGold){
                Share.shareGetGold(this._addGold);
            }else if(this._type == ShareType.shareGetEnergy){
                Share.shareGetEnergy(this._addEnergy,btnFrom,btnTo);
            }else if(this._type == ShareType.shareGetWater){
                Share.shareGetWater(this._addWater,btnFrom,btnTo);
            }
            this.onClose(e);
        },()=>{
            UI.showTip("分享失败!");
            this.onClose(e);
        });
    }

    // update (dt) {}
}
