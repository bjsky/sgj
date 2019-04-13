import ButtonEffect from "../component/ButtonEffect";
import { SceneCont, ConfigConst, ResConst } from "../GlobalData";
import DList, { DListDirection } from "../component/DList";
import { CFG } from "../core/ConfigManager";
import { Farm } from "../game/farm/FarmController";
import { UI } from "../core/UIManager";
import { EVENT } from "../core/EventController";
import GameEvent from "../GameEvent";
import FarmlandInfo from "../FarmlandInfo";
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

    @property(cc.Node) sceneNode: cc.Node = null;
    @property(cc.Node) sprTrans: cc.Node = null;

    @property(DList) seedList: DList = null;
    @property([cc.Node]) farmlandNodes: cc.Node[] = [];
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.moveInAction(()=>{
            // SOUND.playFarmBgSound();
        });
    }

    onEnable(){
        EVENT.on(GameEvent.PlantTree,this.onPlantTree,this);
        this.initScene();

        this.seedList.node.on(DList.ITEM_CLICK,this.onListItemClick,this);
    }


    onDisable(){
        EVENT.off(GameEvent.PlantTree,this.onPlantTree,this);
        this.clearScene();

        this.seedList.node.off(DList.ITEM_CLICK,this.onListItemClick,this);
    }

    private initScene(){

        this.btnToSlot.node.on(ButtonEffect.CLICK_END,this.onGoSlot,this);

        this.initSeedList();
        this.initFarmland();
    }

    private clearScene(){

        this.btnToSlot.node.off(ButtonEffect.CLICK_END,this.onGoSlot,this);
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
        for(var i:number = 0;i<this.farmlandNodes.length;i++){
            farmlandNode = this.farmlandNodes[i];
            farmland = Farm.getFarmlandAtIndex(i);
            if(farmland == null){
                continue;
            }else{
                UI.loadUI(ResConst.FarmlandUI,{farmland:farmland},farmlandNode);
            }
        }
    }

    private onListItemClick(e){
        var seedId:number = Number(e.data.id);
        var index:number = Farm.getIdleFarmlandIndex();
        if(index<0){
            UI.showTip("没有空闲土地");
            return;
        }else{
            Farm.plantOnce(seedId,index);
        }
    }

    private onPlantTree(e){
        var treeid:number = e.seedId;
        var index:number = e.index;
        var farmlandNode:cc.Node = this.farmlandNodes[index];
        var farmland:FarmlandInfo = Farm.getFarmlandAtIndex(index);
        if(farmland!=null){
            UI.loadUI(ResConst.FarmlandUI,{farmland:farmland},farmlandNode);
        }
    }   

    // update (dt) {}
}