import { NET } from "../../core/net/NetController";
import MsgPlant from "../../message/MsgPlant";
import { Common } from "../../CommonData";
import { EVENT } from "../../core/EventController";
import GameEvent from "../../GameEvent";
import { SFarmlandInfo } from "../../message/MsgLogin";
import FarmlandInfo from "../../FarmlandInfo";

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
    private _farmlands:SFarmlandInfo[] = null;
    public initFromServer(farmlands:SFarmlandInfo[]){
        this._farmlands = farmlands;
        this._farmlandsDic = {};
        farmlands.forEach((tr:SFarmlandInfo)=>{
            var farmland:FarmlandInfo = new FarmlandInfo();
            farmland.initFromServer(tr);
            this._farmlandsDic[farmland.index] = farmland;
        });
    }

    public cloneServerInfo():SFarmlandInfo[]{
        return this._farmlands.slice();
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
        NET.send(MsgPlant.create(seedId,index),(msg:MsgPlant)=>{
            if(msg && msg.resp){
                Common.resInfo.updateInfo(msg.resp.resInfo);
                this.updateFarmlands(msg.resp.farmlands);
                EVENT.emit(GameEvent.PlantTree,{index:index,seedId:seedId});
            }
        },this)
    }

    private updateFarmlands(farmlands:SFarmlandInfo[]){
        this.initFromServer(farmlands);
    }
}

export var Farm:FarmController = FarmController.getInstance();
