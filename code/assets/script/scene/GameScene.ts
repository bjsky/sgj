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


    @property(cc.Label) lblName: cc.Label = null;
    @property(cc.Label) lblScore: cc.Label = null;
    @property(cc.Label) lblAddExp: cc.Label = null;

    @property(cc.ProgressBar) proExp: cc.ProgressBar = null;

    @property(cc.Label) lblCost: cc.Label = null;
    @property(cc.Label) lblMuti: cc.Label = null;

    @property(cc.Button) btnCostAdd: cc.Button = null;
    @property(cc.Button) btnCostSub: cc.Button = null;
    @property(cc.Button) btnMutiAdd: cc.Button = null;
    @property(cc.Button) btnMutiSub: cc.Button = null;

    @property(ExpLevelEffect) explevelEffect:ExpLevelEffect = null;
    @property(NumberEffect) goldEffect:NumberEffect = null;

    @property(cc.Node) houseNode:cc.Node = null;
    @property(cc.Sprite) sprStar: cc.Sprite = null;
    @property(cc.Node) coinIcon:cc.Node = null;
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
    }

    onDisable(){

        EVENT.off(GameEvent.Loading_complete,this.initGameView,this);
        EVENT.off(GameEvent.Play_Slot,this.onPlaySlot,this);
        EVENT.off(GameEvent.Show_Exp_Fly,this.onShowExpfly,this);
        EVENT.off(GameEvent.Show_Exp_FlyEnd,this.onShowExpflyEnd,this);
        EVENT.off(GameEvent.Show_Gold_Fly,this.onShowGoldfly,this);
    }

    private _gameSlot:GameSlot;
    private initGameView(){

        this._gameSlot = new GameSlot(this);
        this._gameSlot.initSlotView(this.slot1,this.slot2,this.slot3);
        this.initView();
        this.addEventListener();
    }

    private addEventListener(){
        this.btnOn.node.on(ButtonEffect.CLICK_END,this.onSlot,this);
        this.btnCostAdd.node.on(ButtonEffect.CLICK_END,this.onCostAdd,this)
        this.btnCostSub.node.on(ButtonEffect.CLICK_END,this.onCostSub,this)
        this.btnMutiAdd.node.on(ButtonEffect.CLICK_END,this.onMutiAdd,this)
        this.btnMutiSub.node.on(ButtonEffect.CLICK_END,this.onMutiSub,this)

    }

    private onShowExpfly(e){
        var anim:SlotResultAnim = new SlotResultAnim(SlotResultAniEnum.Expfly);
        anim.starTo = this.sprStar.node.parent.convertToWorldSpaceAR(this.sprStar.node.position);
        anim.starFrom = this.houseNode.parent.convertToWorldSpaceAR(this.houseNode.position);
        UI.showWinAnim(anim);

        this.goldEffect.setValue(Common.gold);
    }

    private onShowExpflyEnd(e){
        this.lblScore.string = "种植经验："+Common.userInfo.totalExp;
        this.explevelEffect.playProgressAnim(Common.userInfo.exp,Common.userInfo.levelExp,Common.userInfo.level);
    }

    private onShowGoldfly(e){
        this.goldEffect.setValue(Common.gold);
    }

    private _isSlotLocked:boolean = false;
    private onSlot(e){

        if(Common.gold< this.CurCost){
            console.log("金币不足");
            return;
        }
        if(this._isSlotLocked)
            return;
        this._isSlotLocked = true;
        var input:SlotInputStart = new SlotInputStart(SlotInputEnum.startPlay,this.CurCost);
        Slot.excute(input);
    }

    private onPlaySlot(e){
        var result:SlotWin = e;
        this._gameSlot.playSlotView(result,this.playEnd.bind(this));
    }

    private playEnd(){
        this._isSlotLocked = false;
    }

    private showNothing(){
        this.lblName.string ="";
        this.lblScore.string ="";
        this.lblCost.string = "";
        this.lblMuti.string ="1";
        this.proExp.progress =0;
        this.lblAddExp.string = "";
    }

    private initView(){
        this.explevelEffect.initProgress(Common.userInfo.exp,Common.userInfo.levelExp,Common.userInfo.level);
        this.lblName.string = Common.userInfo.name;
        this.lblScore.string = "种植经验："+Common.userInfo.totalExp;

        this.goldEffect.setValue(Common.gold,false);
        this.updateCostView();
        this.updateMutiView();

        this.lblAddExp.string ="获得种植经验："+this.CurCost;
    }

    private _curCostIndex:number = -1;
    private _costArr:Array<number> = null;
    private updateCostView(){
        this._costArr = Common.getCostArr();
        this._curCostIndex = this._costArr.length-1;
        this.lblCost.string = this._costArr[this._curCostIndex].toString();

    }
    public get CurCost(){
        return this._costArr[this._curCostIndex] *this._mutiArr[this._curMutiIndex];
    }

    private _curMutiIndex:number = -1;
    private _mutiArr:Array<number> = null;
    private updateMutiView(){
        this._mutiArr = Common.getMutiArr();
        this._curMutiIndex = this._mutiArr.length-1;
        this.lblMuti.string = this._mutiArr[this._curMutiIndex].toString();
    }

    private onCostAdd(e){
        this._curCostIndex++;
        if(this._curCostIndex>= this._costArr.length){
            this._curCostIndex = 0;
        }
        this.lblCost.string = this._costArr[this._curCostIndex].toString();
        this.lblAddExp.string ="获得种植经验："+this.CurCost;
    }
    private onCostSub(e){
        this._curCostIndex--;
        if(this._curCostIndex<0){
            this._curCostIndex = this._costArr.length-1;
        }
        this.lblCost.string = this._costArr[this._curCostIndex].toString();
        this.lblAddExp.string ="获得种植经验："+this.CurCost;
    }
    private onMutiAdd(e){
        this._curMutiIndex++;
        if(this._curMutiIndex>= this._mutiArr.length){
            this._curMutiIndex = 0;
        }
        this.lblMuti.string = this._mutiArr[this._curMutiIndex].toString();
        this.lblAddExp.string ="获得种植经验："+this.CurCost;
    }
    private onMutiSub(e){
        this._curMutiIndex--;
        if(this._curMutiIndex<0){
            this._curMutiIndex = this._mutiArr.length-1;
        }
        this.lblMuti.string = this._mutiArr[this._curMutiIndex].toString();
        this.lblAddExp.string ="获得种植经验："+this.CurCost;
    }
    // update (dt) {}
}
