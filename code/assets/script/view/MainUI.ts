import UIBase from "../component/UIBase";
import ExpLevelEffect from "../component/ExpLevelEffect";
import NumberEffect from "../component/NumberEffect";
import { EVENT } from "../core/EventController";
import GameEvent from "../GameEvent";
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
export default class MainUI extends UIBase {

    @property(cc.Label) lblTitle: cc.Label = null;
    @property(cc.Label) lblName: cc.Label = null;
    @property(cc.Label) lblScore: cc.Label = null;


    @property(cc.ProgressBar) proExp: cc.ProgressBar = null;


    @property(ExpLevelEffect) explevelEffect:ExpLevelEffect = null;
    @property(NumberEffect) goldEffect:NumberEffect = null;


    @property(cc.Sprite) sprStar: cc.Sprite = null;
    @property(cc.Node) coinIcon:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.hideAll();
    }

    onEnable(){
        EVENT.on(GameEvent.Loading_complete,this.initView,this);
        
        EVENT.on(GameEvent.Show_Exp_FlyEnd,this.onShowExpflyEnd,this);
        EVENT.on(GameEvent.Show_Gold_Fly,this.onShowGoldfly,this);
        EVENT.on(GameEvent.UpgreadUI_Closed,this.onUpgradeUIClose,this);
        EVENT.on(GameEvent.PlantTree,this.onPlantTree,this);
    }

    onDisable(){
        EVENT.off(GameEvent.Loading_complete,this.initView,this);
        
        EVENT.off(GameEvent.Show_Exp_FlyEnd,this.onShowExpflyEnd,this);
        EVENT.off(GameEvent.Show_Gold_Fly,this.onShowGoldfly,this);
        EVENT.off(GameEvent.UpgreadUI_Closed,this.onUpgradeUIClose,this);
        EVENT.off(GameEvent.PlantTree,this.onPlantTree,this);
    }

    private hideAll(){
        this.lblName.string ="";
        this.lblScore.string ="";
        this.proExp.progress =0;
        this.lblTitle.string ="";
    }

    private initView(e){

        this.explevelEffect.initProgress(Common.userInfo.exp,Common.userInfo.levelExp,Common.userInfo.level);
        this.lblName.string = Common.userInfo.name;
        this.lblTitle.string = Common.userInfo.title;
        this.lblScore.string = "种植经验："+Common.userInfo.totalExp;
        this.goldEffect.setValue(Common.resInfo.gold,false);
    }

    private onUpgradeUIClose(e){

        this.lblTitle.string = Common.userInfo.title;
    }


    private onShowExpflyEnd(e){

        this.lblScore.string = "种植经验："+Common.userInfo.totalExp;
        this.explevelEffect.playProgressAnim(Common.userInfo.exp,Common.userInfo.levelExp,Common.userInfo.level);
    }

    private onShowGoldfly(e){
        this.goldEffect.setValue(Common.resInfo.gold);
    }
    private onPlantTree(e){
        this.goldEffect.setValue(Common.resInfo.gold);
    }
    start () {

    }

    // update (dt) {}
}
