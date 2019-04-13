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
export default class FarmScene extends cc.Component {


    @property(cc.Button) btnToSlot: cc.Button = null;
    @property(cc.Button) btnPick: cc.Button = null;
    @property(cc.Node) pickNode:cc.Node = null;


    @property(cc.Node) sceneNode: cc.Node = null;
    @property(cc.Node) sprTrans: cc.Node = null;

    @property(DList) seedList: DList = null;
    @property([cc.Node]) farmlandNodes: cc.Node[] = [];
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _farmlandNodeDic:any = {};
    public getFarmlandUIWithIdx(indx:number):FarmlandUI{
        return this._farmlandNodeDic[indx];
    }
    start () {
        this.moveInAction(()=>{
            // SOUND.playFarmBgSound();
        });
    }

    onEnable(){
        EVENT.on(GameEvent.Plant_Tree,this.onPlantTree,this);
        EVENT.on(GameEvent.Update_Tree,this.onUpdateTree,this);
        EVENT.on(GameEvent.Remove_Tree,this.onRemoveTree,this);
        this.initScene();
    }


    onDisable(){
        EVENT.off(GameEvent.Plant_Tree,this.onPlantTree,this);
        EVENT.off(GameEvent.Update_Tree,this.onUpdateTree,this);
        EVENT.off(GameEvent.Remove_Tree,this.onRemoveTree,this);
        this.clearScene();
    }

    private initScene(){

        this.btnToSlot.node.on(ButtonEffect.CLICK_END,this.onGoSlot,this);
        this.btnPick.node.on(cc.Node.EventType.TOUCH_START,this.onDragStart,this);

        this.initSeedList();
        this.initFarmland();
    }

    private clearScene(){

        this.btnToSlot.node.off(ButtonEffect.CLICK_END,this.onGoSlot,this);
        this.btnPick.node.off(cc.Node.EventType.TOUCH_START,this.onDragStart,this);
        this._farmlandNodeDic = {};
    }

    private onGoSlot(e){
        this.btnToSlot.node.off(ButtonEffect.CLICK_END,this.onGoSlot,this);
        //去转盘
        cc.director.preloadScene(SceneCont.SlotScene,()=>{
            this.sceneNode.runAction(
                cc.sequence(cc.moveBy(0.15,cc.v2(this.sprTrans.width,0)).easing(cc.easeIn(1.5)),
                cc.callFunc(()=>{
                    cc.director.loadScene(SceneCont.SlotScene);
                }))
            )
        });
    }

    private moveInAction(cb:Function){
        this.sceneNode.x = this.sprTrans.width;
        this.sceneNode.runAction(
            cc.sequence(cc.moveBy(0.15,cc.v2(-this.sprTrans.width,0)).easing(cc.easeOut(1.5)),
            cc.callFunc(cb))
        );
    }


    private initSeedList(){
        var listData:any[] =[];
        var group:any = CFG.getCfgGroup(ConfigConst.Plant);
        for(var key in group){
            listData.push(group[key]);
        }
        this.seedList.direction = DListDirection.Vertical;
        this.seedList.setListData(listData);
    }

    private initFarmland(){
        var farmlandNode:cc.Node;
        var farmland:FarmlandInfo;
        this._farmlandNodeDic = {};
        for(var i:number = 0;i<this.farmlandNodes.length;i++){
            farmlandNode = this.farmlandNodes[i];
            farmland = Farm.getFarmlandAtIndex(i);
            if(farmland == null){
                continue;
            }else{
                UI.loadUI(ResConst.FarmlandUI,{farmland:farmland},farmlandNode,(farmland:FarmlandUI)=>{
                    this._farmlandNodeDic[farmland.index] = farmland;
                });
            }
        }
    }

    private onPlantTree(e){
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

    private onDragStart(e){
        this.btnPick.node.on(CDragEvent.DRAG_END,this.onDragEnd,this);
        Drag.startDrag(this.btnPick.node,{});
    }
    private onDragEnd(e){
        this.btnPick.node.off(CDragEvent.DRAG_END,this.onDragEnd,this);
        Farm.pickServer(()=>{
            EVENT.emit(GameEvent.Pick_Tree_Fly_End,{});
            Common.checkShowLevelup();
            
        });
    }

    private onUpdateTree(e){
        var index:number = e.index;
        var farmland:FarmlandUI = this.getFarmlandUIWithIdx(index);
        if(farmland){
            farmland.onUpdateView();
        }
    }
    private onRemoveTree(e){
        var index:number = e.index;
        var farmland:FarmlandUI = this.getFarmlandUIWithIdx(index);
        if(farmland){
            farmland.onRemoveView(()=>{
                delete this._farmlandNodeDic[farmland.index];
                UI.removeUI(farmland.node)
            });
        }
    }

    // update (dt) {}
}