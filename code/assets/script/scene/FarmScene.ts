import ButtonEffect from "../component/ButtonEffect";
import { SceneCont, ConfigConst, ResConst } from "../GlobalData";
import DList, { DListDirection } from "../component/DList";
import { CFG } from "../core/ConfigManager";
import { Farm } from "../game/farm/FarmController";
import { UI } from "../core/UIManager";
import { EVENT } from "../core/EventController";
import GameEvent from "../GameEvent";
import FarmlandInfo from "../FarmlandInfo";
import { Drag, CDragEvent } from "../core/DragManager";
import FarmlandUI from "../view/Farm/FarmlandUI";
import { Common } from "../CommonData";
import { SlotResultAnim, SlotResultAniEnum } from "../view/AnimUi";
import SeedItem from "../view/Farm/SeedItem";
import { Game } from "../GameController";
import { SOUND } from "../core/SoundManager";
import { ResType } from "../message/MsgAddRes";
import SceneBase, { SceneEnum } from "./SceneBase";

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
export default class FarmScene extends SceneBase{


    @property(cc.Node) uicanvas: cc.Node = null;
    @property(cc.Button) btnToSlot: cc.Button = null;
    @property(cc.Button) btnPick: cc.Button = null;
    @property(cc.Button) btnPickIme: cc.Button = null;
    @property(cc.Node) pickNode:cc.Node = null;

    @property(cc.Node) guideNode:cc.Node = null;


    @property(cc.Node) sceneNode: cc.Node = null;
    // @property(cc.Node) sprTrans: cc.Node = null;

    @property(DList) seedList: DList = null;
    @property([cc.Node]) farmlandNodes: cc.Node[] = [];


    @property(cc.Label) lblWater: cc.Label = null;
    @property(cc.Node) iconWater: cc.Node = null;
    
    constructor(){
        super();
        this.sceneName = SceneEnum.Farm;
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _farmlandNodeDic:any = {};
    public getFarmlandUIWithIdx(indx:number):FarmlandUI{
        return this._farmlandNodeDic[indx];
    }
    start () {
        this.guideNode.active = false;
        if(Game.loadingComplete){
            this.initScene();
            this.moveInAction(()=>{
                // SOUND.playFarmBgSound();
            });
        }else{
            Game.startGame(this.uicanvas);
        }
    }

    onEnable(){
        EVENT.on(GameEvent.Loading_complete,this.onLoadingComplete,this);
        EVENT.on(GameEvent.Plant_Tree,this.onPlantTree,this);
        EVENT.on(GameEvent.Update_Tree,this.onUpdateTree,this);
        EVENT.on(GameEvent.Remove_Tree,this.onRemoveTree,this);
        EVENT.on(GameEvent.UpgreadUI_Closed,this.onUpgradeUIClose,this);
        EVENT.on(GameEvent.Scene_To_Slot,this.onGoSlot,this);
        EVENT.on(GameEvent.Update_Unlock_Farmland,this.updateUnlockFarmland,this);
        EVENT.on(GameEvent.Get_Res_Finish,this.onGetRes,this);

        this.lblWater.string = "";
    }


    onDisable(){
        EVENT.off(GameEvent.Loading_complete,this.onLoadingComplete,this);
        EVENT.off(GameEvent.Plant_Tree,this.onPlantTree,this);
        EVENT.off(GameEvent.Update_Tree,this.onUpdateTree,this);
        EVENT.off(GameEvent.Remove_Tree,this.onRemoveTree,this);
        EVENT.off(GameEvent.Scene_To_Slot,this.onGoSlot,this);
        EVENT.off(GameEvent.Update_Unlock_Farmland,this.updateUnlockFarmland,this);
        EVENT.on(GameEvent.Get_Res_Finish,this.onGetRes,this);

        this.clearScene();
    }

    private onGetRes(e){
        if(e.type == ResType.Water){
            this.lblWater.string = Common.resInfo.water.toString();
        }
    }

    private onLoadingComplete(e){
        this.initScene();
        SOUND.playFarmBgSound();
        console.log(Common.newUser)
        if(Common.newUser ==1){ //新用户
            this.scheduleOnce(()=>{
                this.guideNode.active = true;
            },0.6)
        }
    }

    private hideGuide(){
        this.guideNode.active = false;
    }
    private initScene(){

        this.btnToSlot.node.on(ButtonEffect.CLICK_END,this.onGoSlot,this);
        this.btnPick.node.on(cc.Node.EventType.TOUCH_START,this.onDragStart,this);
        this.btnPickIme.node.on(cc.Node.EventType.TOUCH_START,this.onPickImeDragStart,this);

        this.initSeedList();
        this.initFarmland();
        this.pickImmediatley = Farm.pickImmediatly;

        this.lblWater.string = Common.resInfo.water.toString();
    }
    private clearScene(){

        this.btnToSlot.node.off(ButtonEffect.CLICK_END,this.onGoSlot,this);
        this.btnPick.node.off(cc.Node.EventType.TOUCH_START,this.onDragStart,this);
        this.btnPickIme.node.off(cc.Node.EventType.TOUCH_START,this.onPickImeDragStart,this);
        this._farmlandNodeDic = {};
        this.hideGuide();
    }

    private onGoSlot(e){
        this.btnToSlot.node.off(ButtonEffect.CLICK_END,this.onGoSlot,this);
        //去转盘
        cc.director.preloadScene(SceneCont.SlotScene,()=>{
            this.sceneNode.runAction(
                cc.sequence(
                    cc.fadeOut(0.1),// cc.moveBy(0.2,cc.v2(-this.sprTrans.width,0)),//.easing(cc.easeOut(1.5)),
                cc.callFunc(()=>{
                    cc.director.loadScene(SceneCont.SlotScene);
                }))
            )
        });
    }

    private moveInAction(cb:Function){
        // this.sceneNode.x = -this.sprTrans.width;
        this.sceneNode.runAction(
            cc.sequence(
                cc.fadeIn(0.1),
                // cc.moveBy(0.2,cc.v2(this.sprTrans.width,0)),//.easing(cc.easeIn(1.5)),
            cc.callFunc(cb))
        );
    }
    private onUpgradeUIClose(e){
        var plantUnlockCfg:any[] = CFG.getCfgByKey(ConfigConst.Plant,"unlocklv",Common.userInfo.level);
        if(plantUnlockCfg.length>0){
            var levelcfg = plantUnlockCfg[0];
            var seedItem :SeedItem= this.seedList.getItemAt(this._listData.indexOf(levelcfg)) as SeedItem;
            seedItem.updateUnlock();
            this.initSeedList();
        }
    }

    private _listData:any[] = [];
    private initSeedList(){
        var group:any = CFG.getCfgGroup(ConfigConst.Plant);
        var lockArr:Array<any> = [];
        var openArr:Array<any> = [];
        for(var key in group){
            if(Number(group[key].unlocklv)>Common.userInfo.level){
                lockArr.push(group[key]);
            }else{
                openArr.unshift(group[key]);
            }
        }
        if(openArr.length>0){
            lockArr.unshift(openArr.shift())
        }
        this._listData = lockArr.concat(openArr);
        this.seedList.direction = DListDirection.Vertical;
        this.seedList.setListData(this._listData);
    }

    private initFarmland(){
        var farmlandNode:cc.Node;
        var farmland:FarmlandInfo;
        this._farmlandNodeDic = {};
        for(var i:number = 0;i<this.farmlandNodes.length;i++){
            farmlandNode = this.farmlandNodes[i];
            farmland = Farm.getFarmlandAtIndex(i);
            if(farmland == null){
                farmland = Farm.getUnlockFarmlandInfo(i);
                if(farmland){
                    UI.loadUI(ResConst.FarmlandUI,{farmland:farmland},farmlandNode,(farmland:FarmlandUI)=>{
                        this._farmlandNodeDic[farmland.index] = farmland;
                    });
                }else{
                    continue;
                }
            }else{
                UI.loadUI(ResConst.FarmlandUI,{farmland:farmland},farmlandNode,(farmland:FarmlandUI)=>{
                    this._farmlandNodeDic[farmland.index] = farmland;
                });
            }
        }
    }

    private onPlantTree(e){
        this.hideGuide();
        var treeid:number = e.seedId;
        var index:number = e.index;
        var farmlandNode:cc.Node = this.farmlandNodes[index];
        var farmland:FarmlandInfo = Farm.getFarmlandAtIndex(index);
        if(farmland!=null){
            UI.loadUI(ResConst.FarmlandUI,{farmland:farmland},farmlandNode,(farmland:FarmlandUI)=>{
                this._farmlandNodeDic[farmland.index] = farmland;
            });
        }
    }   

    private updateUnlockFarmland(e){
        var reIndex:number = e.removeIndex;
        var upIndex:number = e.updateIndex;
        if(reIndex>=0){
            var farmland:FarmlandUI = this.getFarmlandUIWithIdx(reIndex);
            farmland.onRemoveView(()=>{
                delete this._farmlandNodeDic[farmland.index];
                UI.removeUI(farmland.node)
            });
        }
        var updateFarmland = this.getFarmlandUIWithIdx(upIndex);
        if(updateFarmland){
            updateFarmland.onUpdateLock();
        }
    }

    private onDragStart(e){
        this.btnPick.node.on(CDragEvent.DRAG_END,this.onDragEnd,this);
        Drag.startDrag(this.btnPick.node,{});
    }
    private onPickImeDragStart(e){
        this.btnPickIme.node.on(CDragEvent.DRAG_END,this.onPickImeDragEnd,this);
        Drag.startDrag(this.btnPickIme.node,{});
    }
    private onDragEnd(e){
        this.btnPick.node.off(CDragEvent.DRAG_END,this.onDragEnd,this);
        Farm.pickServer(()=>{
            var anim:SlotResultAnim = new SlotResultAnim(SlotResultAniEnum.PickTreefly);
            anim.starTo = UI.main.sprStar.node.parent.convertToWorldSpaceAR(UI.main.sprStar.node.position);
            UI.showWinAnim(anim);
        });
    }
    private onPickImeDragEnd(e){
        this.btnPickIme.node.off(CDragEvent.DRAG_END,this.onPickImeDragEnd,this);
        this.pickImmediatley = false;
        Farm.pickImmediatly = false;
        Farm.pickServer(()=>{
            var anim:SlotResultAnim = new SlotResultAnim(SlotResultAniEnum.PickTreefly);
            anim.starTo = UI.main.sprStar.node.parent.convertToWorldSpaceAR(UI.main.sprStar.node.position);
            UI.showWinAnim(anim);
        });
    }

    public set pickImmediatley(bool:boolean){
        this.btnPick.node.active = !bool;
        this.btnPickIme.node.active = bool;
    }

    private onUpdateTree(e){

        this.lblWater.string = Common.resInfo.water.toString();
        // var index:number = e.index;
        // var farmland:FarmlandUI = this.getFarmlandUIWithIdx(index);
        // if(farmland){
        //     farmland.onUpdateView();
        // }
    }
    private onRemoveTree(e){
        var index:number = e.index;
        var farmland:FarmlandUI = this.getFarmlandUIWithIdx(index);
        if(farmland){
            var anim:SlotResultAnim = new SlotResultAnim(SlotResultAniEnum.PickTreeStand);
            // anim.starTo = UI.main.sprStar.node.parent.convertToWorldSpaceAR(UI.main.sprStar.node.position);
            anim.starFrom = farmland.node.parent.convertToWorldSpaceAR(farmland.node.position).add(cc.v2(0,10));
            UI.showWinAnim(anim);
            farmland.onRemoveView(()=>{
                delete this._farmlandNodeDic[farmland.index];
                UI.removeUI(farmland.node)
            });
        }
    }


    // update (dt) {}
}