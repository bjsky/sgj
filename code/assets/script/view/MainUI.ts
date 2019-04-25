import UIBase from "../component/UIBase";
import ExpLevelEffect from "../component/ExpLevelEffect";
import NumberEffect from "../component/NumberEffect";
import { EVENT } from "../core/EventController";
import GameEvent from "../GameEvent";
import { Common } from "../CommonData";
import ResBounceEffect from "../component/ResBounceEffect";
import { SOUND } from "../core/SoundManager";
import { Farm } from "../game/farm/FarmController";

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

    @property(cc.Label) lblLevelEx: cc.Label = null;
    @property(cc.Label) lblLevel: cc.Label = null;
    @property(cc.Label) lblGold: cc.Label = null;
    @property(cc.Label) lblTitle: cc.Label = null;
    @property(cc.Label) lblName: cc.Label = null;
    @property(cc.Label) lblScore: cc.Label = null;


    @property(cc.ProgressBar) proExp: cc.ProgressBar = null;


    @property(ExpLevelEffect) explevelEffect:ExpLevelEffect = null;
    @property(NumberEffect) goldEffect:NumberEffect = null;
    @property(ResBounceEffect) goldBounceEffect:ResBounceEffect = null;
    @property(ResBounceEffect) expBounceEffect:ResBounceEffect = null;


    @property(cc.Sprite) sprStar: cc.Sprite = null;
    @property(cc.Node) coinIcon:cc.Node = null;

    @property(cc.Label) lblExpAdd: cc.Label = null;
    @property(cc.Node) nodeExpAdd: cc.Node = null;
    @property(cc.Node) expAddIcon: cc.Node = null;

    @property(cc.Node) subContent: cc.Node = null;
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.hideAll();
    }

    onEnable(){
        EVENT.on(GameEvent.Loading_complete,this.initView,this);
        
        EVENT.on(GameEvent.Show_Exp_FlyEnd,this.onShowExpflyEnd,this);
        EVENT.on(GameEvent.Show_Gold_Fly,this.onShowGoldfly,this);
        EVENT.on(GameEvent.UpgreadUI_Closed,this.onUpgradeUIClose,this);
        EVENT.on(GameEvent.Plant_Tree,this.onPlantTree,this);

        this.subContent.active = false;
    }

    onDisable(){
        EVENT.off(GameEvent.Loading_complete,this.initView,this);
        
        EVENT.off(GameEvent.Show_Exp_FlyEnd,this.onShowExpflyEnd,this);
        EVENT.off(GameEvent.Show_Gold_Fly,this.onShowGoldfly,this);
        EVENT.off(GameEvent.UpgreadUI_Closed,this.onUpgradeUIClose,this);
        EVENT.off(GameEvent.Plant_Tree,this.onPlantTree,this);
    }

    private hideAll(){
        this.lblLevelEx.string ="";
        this.lblLevel.string ="";
        this.lblGold.string = "";
        this.lblName.string ="";
        this.lblScore.string ="";
        this.proExp.progress =0;
        this.lblTitle.string ="";
        this.nodeExpAdd.active = false;
        this.lblExpAdd.string ="";
    }

    private initView(e){
        this.lblLevelEx.string ="Lv.";
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
        this.playExpBounce();
        this.scheduleOnce(this.checkLevelup,0.4)
        this.refreshExp();
        Farm.pickServer(()=>{
            this.refreshExp();
        })
    }

    private checkLevelup(){
        Common.checkShowLevelup();
    }

    private refreshExp(){
        this.lblScore.string = "种植经验："+Common.userInfo.totalExp;
        this.explevelEffect.playProgressAnim(Common.userInfo.exp,Common.userInfo.levelExp,Common.userInfo.level);
    }


    // private _expAddShowed:boolean =false;
    // private showExpAdd(num:number){
    //     if(this._expAddShowed){

    //     }
    // }

    private onShowGoldfly(e){
        this.goldEffect.setValue(Common.resInfo.gold);
    }
    private onPlantTree(e){
        this.goldEffect.setValue(Common.resInfo.gold);
    }
    start () {

    }

    public playExpBounce(){
        this.expBounceEffect.play();
        SOUND.playStarBounceSound();
    }

    public playGoldBounce(){
        this.goldBounceEffect.play();
    }

    // update (dt) {}
}
