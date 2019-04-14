import { NET } from "../../core/net/NetController";
import MsgPlant from "../../message/MsgPlant";
import { Common } from "../../CommonData";
import { EVENT } from "../../core/EventController";
import GameEvent from "../../GameEvent";
import { SFarmlandInfo } from "../../message/MsgLogin";
import FarmlandInfo from "../../FarmlandInfo";
import MsgPick from "../../message/MsgPick";
import { CFG } from "../../core/ConfigManager";
import { ConfigConst } from "../../GlobalData";

export default class FarmController{

    private static _instance: FarmController = null;
    public static getInstance(): FarmController {
        if (FarmController._instance == null) {
            FarmController._instance = new FarmController();
            
        }
        return FarmController._instance;
    }
    public _farmlandCount:number = 9;

    private _farmlandsDic:any = {};
    public initFromServer(farmlands:SFarmlandInfo[]){
        this._farmlandsDic = {};
        farmlands.forEach((tr:SFarmlandInfo)=>{
            var farmland:FarmlandInfo = new FarmlandInfo();
            farmland.initFromServer(tr);
            this._farmlandsDic[farmland.index] = farmland;
        });
    }

    public getIdleFarmlandIndex():number{
        for(var i:number = 0;i<this._farmlandCount;i++){
            if(this._farmlandsDic[i]==undefined){
                return i;
            }
        }
        return -1;
    }

    public getFarmlandAtIndex(index:number):FarmlandInfo{
        if(this._farmlandsDic[index]!=undefined ||this._farmlandsDic[index]!=null){
            return this._farmlandsDic[index];
        }else{
            return null;
        }
    }

    public plantOnce(seedId:number,index:number){
        var seedCfg:any = CFG.getCfgDataById(ConfigConst.Plant,seedId);
        var costGold:number = Number(seedCfg.plantcost);
        NET.send(MsgPlant.create(seedId,index,costGold),(msg:MsgPlant)=>{
            if(msg && msg.resp){
                Common.resInfo.updateInfo(msg.resp.resInfo);
                var farmland = new FarmlandInfo();
                farmland.initFromServer(msg.resp.farmland);
                this._farmlandsDic[index] = farmland;
                EVENT.emit(GameEvent.Plant_Tree,{index:index,seedId:seedId});
            }
        },this)
    }

    private updateFarmland(index:number,farmland:FarmlandInfo){
        this._farmlandsDic[index] = farmland;
        EVENT.emit(GameEvent.Update_Tree,{index:index});
    }

    private removeFarmland(index:number){
        delete this._farmlandsDic[index];
        EVENT.emit(GameEvent.Remove_Tree,{index:index});
    }


    private _pickIndex:Array<number> = [];
    private _addExp:number = 0;
    public pickOnce(index:number,addExp:number){
        if(this._pickIndex.indexOf(index)<0){
            this._pickIndex.push(index);
            this._addExp += addExp;
            // var farmland:FarmlandInfo = this.getFarmlandAtIndex(index);
            // if(farmland.pickTimes>0){
            //     farmland.pickTimes --;
            //     farmland.growthStartTime = Common.getServerTime();
            //     this.updateFarmland(index,farmland);
            // }else{
                this.removeFarmland(index);
            // }
        }
    }

    public pickServer(cb:Function){
        if(this._pickIndex.length>0){
            var pickstr:string = this._pickIndex.join(";");
            var addExp:number = this._addExp;
            this._pickIndex= [];
            this._addExp = 0;
            NET.send(MsgPick.create(pickstr,addExp),(msg:MsgPick)=>{
                if(msg && msg.resp){
                    Common.updateUserInfo(msg.resp.userInfo);
                    cb && cb();
                }
            },this);
        }
    }
}

export var Farm:FarmController = FarmController.getInstance();
