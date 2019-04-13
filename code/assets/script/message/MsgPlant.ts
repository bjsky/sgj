import MessageBase from "../core/net/MessageBase";
import NetConst from "../NetConst";
import { SResInfo, SFarmlandInfo} from "./MsgLogin";
import { Common } from "../CommonData";
import { CFG } from "../core/ConfigManager";
import { ConfigConst } from "../GlobalData";
import { Farm } from "../game/farm/FarmController";
import StringUtil from "../utils/StringUtil";

export class CSPlant{
    public treeType:number = 0;
    public index:number = 0;
}

export class SCPlant{
    public resInfo:SResInfo = null;
    public farmlands:SFarmlandInfo[] = null;

    public static parse(obj:any):SCPlant{
        var info:SCPlant = new SCPlant();
        info.resInfo = SResInfo.parse(obj.resInfo);
        info.farmlands = [];
        obj.farmlands.forEach((farmland) => {
            info.farmlands.push(SFarmlandInfo.parse(farmland));
        });
        return info;
    }
}

export default class MsgPlant extends MessageBase {
    public param:CSPlant;
    public resp:SCPlant;

    constructor(){
        super(NetConst.Plant);
        // this.isLocal = true;
    }

    public static create(treeType:number,index:number){
        var msg = new MsgPlant();
        msg.param = new CSPlant();
        msg.param.treeType = treeType;
        msg.param.index = index;
        return msg;
    }

    public respFromLocal(){
        var resInfo:SResInfo = Common.resInfo.cloneServerInfo();
        var seedCfg:any = CFG.getCfgDataById(ConfigConst.Plant,this.param.treeType);
        var costGold:number = Number(seedCfg.plantcost);
        resInfo.gold -= costGold;
        var farmlands:SFarmlandInfo[] = Farm.cloneServerInfo();
        var farmland:SFarmlandInfo = new SFarmlandInfo();
        farmland.index = this.param.index;
        farmland.treeType = this.param.treeType;
        farmland.treeUid = StringUtil.getUUidClient();
        farmland.pickTimes = Number(seedCfg.growthCount);
        farmlands.push(farmland);
        var json:any = {
            resInfo:resInfo,
            farmlands:farmlands
        };
        return this.parse(json);
    }


    private parse(obj:any):MessageBase{
        this.resp = SCPlant.parse(obj);
        return this;
    }

    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}
