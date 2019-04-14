import FarmlandInfo from "../../FarmlandInfo";
import UIBase from "../../component/UIBase";
import { CFG } from "../../core/ConfigManager";
import { ConfigConst } from "../../GlobalData";
import { Drag, CDragEvent } from "../../core/DragManager";
import { Farm } from "../../game/farm/FarmController";
import { UI } from "../../core/UIManager";
import { Common } from "../../CommonData";
import StringUtil from "../../utils/StringUtil";
import LoadSprite from "../../component/LoadSprite";
import PathUtil from "../../utils/PathUtil";

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

export enum FarmlandState{
    Planting =1,
    Planed
}
@ccclass
export default class FarmlandUI extends UIBase {

    @property(LoadSprite) sprTree: LoadSprite = null;
    @property(cc.Node) nodeProgress: cc.Node = null;
    @property(cc.ProgressBar) plantProgress: cc.ProgressBar = null;
    @property(cc.Label) lblProgress: cc.Label = null;
    

    private _farmland:FarmlandInfo = null;
    private _growthTotalTime:number = 0;
    private _growthStartTime:number = 0;
    // private _pickTimes:number = 0;
    private _addExp:number = 0;
    private _treeIcon:string ="";

    private _state:FarmlandState = 0;
    public get index(){
        return this._farmland.index;
    }

    public setData(data:any){
        super.setData(data);
        this._farmland = data.farmland;
        this._growthStartTime = this._farmland.growthStartTime;
        // this._pickTimes = this._farmland.pickTimes;
        var cfg:any = CFG.getCfgDataById(ConfigConst.Plant,this._farmland.treeType);
        this._growthTotalTime = Number(cfg.growthTime);
        this._addExp = Number(cfg.addExpPer);
        this._treeIcon = cfg.icon;
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable(){
        Drag.addDragMove(this.node);
        this.node.on(CDragEvent.DRAG_MOVE,this.onDragMove,this);
        this._state = this.growthTime>=this._growthTotalTime?FarmlandState.Planed:FarmlandState.Planting;
        this.onStateChange();
        // this.pickCount.string = this._pickTimes.toString();
        // this.nodePick.active = this._pickTimes>0;
    }
    private onStateChange(){
        if(this._state == FarmlandState.Planed){
            this.nodeProgress.active = false;
            this.sprTree.load(this._treeIcon)
        }else if(this._state == FarmlandState.Planting){
            this.nodeProgress.active = true;
            this.sprTree.load(this._treeIcon+'_g')
        }
    }

    onDisable(){
        Drag.removeDragMove(this.node);
        this.node.off(CDragEvent.DRAG_MOVE,this.onDragMove,this);
    }

    public onUpdateView(){
        var farmland = Farm.getFarmlandAtIndex(this.index);
        this._farmland = farmland;
        // this._pickTimes = this._farmland.pickTimes;
        this._growthStartTime = this._farmland.growthStartTime;
        this._state = FarmlandState.Planting;
        this.onStateChange();
        // this.pickCount.string = this._pickTimes.toString();
        // this.nodePick.active = this._pickTimes>0;
    }

    public onRemoveView(cb:Function){
        cb && cb();
    }

    start () {

    }

    public get growthTime(){
        return (Common.getServerTime() - this._growthStartTime)/1000;
    }
    update (dt) {
        if(this._state == FarmlandState.Planting){
            var growTime = this.growthTime;
            
            if(growTime>= this._growthTotalTime){
                this._state = FarmlandState.Planed;
                this.onStateChange();
            }else{
                var levelTime:number = Math.ceil(this._growthTotalTime - growTime);
                this.lblProgress.string = StringUtil.formatTimeHMS(levelTime,2);
                var pro:number = (this._growthTotalTime - growTime)/this._growthTotalTime;
                this.plantProgress.progress = pro;    
            }
        }
    }

    private onDragMove(e){
        if(this._state == FarmlandState.Planed){
            Farm.pickOnce(this._farmland.index,this._addExp);
        }
    }
}
