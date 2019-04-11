import { Game } from "../GameController";
import { UI } from "../core/UIManager";
import { Slot } from "../game/SlotController";
import SlotView from "../game/SlotView";
import { EVENT } from "../core/EventController";
import GameEvent from "../GameEvent";
import ButtonEffect from "../component/ButtonEffect";
import { Common } from "../CommonData";
import ExpLevelEffect from "../component/ExpLevelEffect";
import NumberEffect from "../component/NumberEffect";
import { SlotInputStart, SlotInputEnum } from "../game/SlotInput";
import SlotWin from "../game/SlotWin";
import GameSlot from "./GameSlot";
import { SlotResultAnim, SlotResultAniEnum } from "../view/AnimUi";
import { ResConst, ConfigConst } from "../GlobalData";
import { GetGoldViewType } from "../view/GetGold";
import { CFG } from "../core/ConfigManager";
import SlotNode from "../game/SlotNode";
import { SOUND } from "../component/SoundManager";

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
export default class GameScene extends cc.Component {

    @property(cc.Node) uicanvas: cc.Node = null;
    @property(SlotView) slot1: SlotView = null;
    @property(SlotView) slot2: SlotView = null;
    @property(SlotView) slot3: SlotView = null;
    @property(cc.Button) btnOn: cc.Button = null;

    @property(cc.Button) btnBuyLife: cc.Button = null;

    @property(cc.Label) lblTitle: cc.Label = null;
    @property(cc.Label) lblName: cc.Label = null;
    @property(cc.Label) lblScore: cc.Label = null;
    @property(cc.Label) lblAddExp: cc.Label = null;
    @property(cc.Label) lblLifeDesc: cc.Label = null;

    @property(cc.ProgressBar) proExp: cc.ProgressBar = null;


    @property(ExpLevelEffect) explevelEffect:ExpLevelEffect = null;
    @property(NumberEffect) goldEffect:NumberEffect = null;

    @property(cc.Node) houseNode:cc.Node = null;
    @property(cc.Sprite) sprStar: cc.Sprite = null;
    @property(cc.Node) coinIcon:cc.Node = null;

    @property(cc.Label) lblTotalLife: cc.Label = null;
    @property(cc.Label) lblcostLife: cc.Label = null;

    @property(SlotNode) slotNode: SlotNode = null;

    @property(cc.Node) lightLeft: cc.Node = null;
    @property(cc.Node) lightRight: cc.Node = null;
    @property(cc.Label) bigwinTimes: cc.Label = null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        UI.registerLayer(this.uicanvas)
        this.showNothing();

    }


    start () {

        Game.startGame();

    }

    onEnable(){
        EVENT.on(GameEvent.Loading_complete,this.initGameView,this);
        EVENT.on(GameEvent.Play_Slot,this.onPlaySlot,this);
        EVENT.on(GameEvent.Show_Exp_Fly,this.onShowExpfly,this);
        EVENT.on(GameEvent.Show_Exp_FlyEnd,this.onShowExpflyEnd,this);
        EVENT.on(GameEvent.Show_Gold_Fly,this.onShowGoldfly,this);
        EVENT.on(GameEvent.UpgreadUI_Closed,this.onUpgradeUIClose,this);
        EVENT.on(GameEvent.BigWin_Start,this.onBigwinStart,this);
        EVENT.on(GameEvent.BigWin_updateTurn,this.onBigwinTurn,this);
        EVENT.on(GameEvent.BigWin_End,this.onBigwinEnd,this);
    }

    onDisable(){

        EVENT.off(GameEvent.Loading_complete,this.initGameView,this);
        EVENT.off(GameEvent.Play_Slot,this.onPlaySlot,this);
        EVENT.off(GameEvent.Show_Exp_Fly,this.onShowExpfly,this);
        EVENT.off(GameEvent.Show_Exp_FlyEnd,this.onShowExpflyEnd,this);
        EVENT.off(GameEvent.Show_Gold_Fly,this.onShowGoldfly,this);
        EVENT.off(GameEvent.UpgreadUI_Closed,this.onUpgradeUIClose,this);
        EVENT.off(GameEvent.BigWin_Start,this.onBigwinStart,this);
        EVENT.off(GameEvent.BigWin_updateTurn,this.onBigwinTurn,this);
        EVENT.off(GameEvent.BigWin_End,this.onBigwinEnd,this);
    }

    private _gameSlot:GameSlot;
    private _addLifeFlyInterval:number = 3;
    private initGameView(){

        this._gameSlot = new GameSlot(this);
        this._gameSlot.initSlotView(this.slot1,this.slot2,this.slot3);
        this._gameSlot.initSlotView2(this.slotNode)
        this.initView();
        this.addEventListener();
        this.schedule(this.lifeReturnFly,this._addLifeFlyInterval,cc.macro.REPEAT_FOREVER);

        SOUND.playBgSound();
    }

    private addEventListener(){
        this.btnOn.node.on(ButtonEffect.CLICK_END,this.onSlot,this);
        this.btnBuyLife.node.on(ButtonEffect.CLICK_END,this.onBuyLife,this);
    }

    private onShowExpfly(e){
        var anim:SlotResultAnim = new SlotResultAnim(SlotResultAniEnum.Expfly);
        anim.starTo = this.sprStar.node.parent.convertToWorldSpaceAR(this.sprStar.node.position);
        anim.starFrom = this.btnOn.node.parent.convertToWorldSpaceAR(this.btnOn.node.position);
        UI.showWinAnim(anim);

        this.lblTotalLife.string = Common.resInfo.life.toString();
    }

    private onShowExpflyEnd(e){

        this.lblScore.string = "种植经验："+Common.userInfo.totalExp;
        this.explevelEffect.playProgressAnim(Common.userInfo.exp,Common.userInfo.levelExp,Common.userInfo.level);
    }

    private onShowGoldfly(e){
        this.goldEffect.setValue(Common.resInfo.gold);
    }

    private _isSlotLocked:boolean = false;
    private onSlot(e){

        if(Common.resInfo.life< this.CurCost){
            UI.createPopUp(ResConst.GetGold,{type:GetGoldViewType.getGold});
            return;
        }
        if(this._isSlotLocked)
            return;
        this._isSlotLocked = true;
        this.btnOn.getComponent(ButtonEffect).enabled = false;
        var input:SlotInputStart = new SlotInputStart(SlotInputEnum.startPlay,this.CurCost);
        Slot.excute(input);
    }

    private onPlaySlot(e){
        var result:SlotWin = e;
        this._gameSlot.playSlotView(result,this.playEnd.bind(this));
    }

    private playEnd(){
        this._isSlotLocked = false;
        this.btnOn.getComponent(ButtonEffect).enabled = true;
        Common.checkShowLevelup();
    }

    private showNothing(){
        this.lblName.string ="";
        this.lblScore.string ="";
        this.proExp.progress =0;
        this.lblAddExp.string = "";
        this.lblTitle.string ="";
        this.lblTotalLife.string = "";
        this.lblcostLife.string = "";
        this.lblLifeDesc.string ="";

        this.lightLeft.opacity = 0;
        this.lightRight.opacity = 0;
    }
    private onUpgradeUIClose(e){
        this.lblTitle.string = Common.userInfo.title;
        this.updateCostView();
    }

    private initView(){
        this.explevelEffect.initProgress(Common.userInfo.exp,Common.userInfo.levelExp,Common.userInfo.level);
        this.lblName.string = Common.userInfo.name;
        this.lblTitle.string = Common.userInfo.title;
        this.lblScore.string = "种植经验："+Common.userInfo.totalExp;
        this.lblTotalLife.string = Common.resInfo.life.toString();

        this.goldEffect.setValue(Common.resInfo.gold,false);
        this.updateCostView();
    }

    private _curPlantCost:number = -1;
    private _curLifeReturn:number = 0;
    private _curLifeReturnMax:number = 0;
    private updateCostView(){
        var levelCfg:any = CFG.getCfgDataById(ConfigConst.Level,Common.userInfo.level);
        if(levelCfg){
            this._curLifeReturn = levelCfg.lifeReturn;
            this._curLifeReturnMax = levelCfg.lifeMax;
            this.lblLifeDesc.string = "精力每分钟恢复："+this._curLifeReturn+"\n恢复上限："+this._curLifeReturnMax;
            this._curPlantCost = Number(levelCfg.cost);
            this.lblcostLife.string = this.CurCost.toString();
            this.lblAddExp.string ="获得种植经验："+this.CurCost;
        }

    }
    public get CurCost(){
        return this._curPlantCost;
    }
    // update (dt) {}

    private lifeReturnFly(){
        if(Common.resInfo.life<this._curLifeReturnMax){
            var addLifeFly:number = Number((this._curLifeReturn*this._addLifeFlyInterval/60).toFixed(0));
            Common.resInfo.life += addLifeFly;
            this.lblTotalLife.string = Common.resInfo.life.toString();
        }
    }

    private onBuyLife(e){
    }

    private _bigwinTiems:number = 0;
    private onBigwinStart(e){
        var seq = cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1)).repeatForever();
        this.lightLeft.runAction(seq);
        var seq1 = cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1)).repeatForever();
        this.lightRight.runAction(seq1);
        this._bigwinTiems = Number(CFG.getCfgByKey(ConfigConst.Constant,"key","bigWinRound")[0].value);
        this.bigwinTimes.string = this._bigwinTiems.toString();
        this.bigwinTimes.node.runAction(cc.sequence(cc.scaleTo(0.1,1.3),cc.scaleTo(0.15,1)));
    }

    private onBigwinTurn(e){
        this._bigwinTiems--;
        if(this._bigwinTiems<0){
            this._bigwinTiems = 0;
        }
        this.bigwinTimes.string = this._bigwinTiems.toString();
        this.bigwinTimes.node.runAction(cc.sequence(cc.scaleTo(0.1,1.3),cc.scaleTo(0.15,1)));
    }

    private onBigwinEnd(e){
        this.lightLeft.stopAllActions();
        this.lightLeft.opacity = 0;
        this.lightRight.stopAllActions();
        this.lightRight.opacity = 0;
    }
}
