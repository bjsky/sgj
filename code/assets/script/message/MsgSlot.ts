import MessageBase from "../core/net/MessageBase";
import NetConst from "../NetConst";
import { Common } from "../CommonData";
import { SUserInfo } from "./MsgLogin";

export class CSSlot{
    public goldCost:number = 0;
    public addExp:number = 0;
}
export class SCSlot{
    public userInfo:SUserInfo = null;
    public gold:number = 0;

    public static parse(obj:any):SCSlot{
        var info:SCSlot = new SCSlot();
        info.userInfo = SUserInfo.parse(obj.userInfo);
        info.gold = obj.gold;
        return info;
    }
}
export default class MsgSlot extends MessageBase {
    public param:CSSlot;
    public resp:any;

    constructor(){
        super(NetConst.Slot);
        // this.isLocal = true;
    }

    public static create(cost:number,addExp:number){
        var msg = new MsgSlot();
        msg.param = new CSSlot();
        msg.param.goldCost = cost;
        msg.param.addExp = addExp;
        return msg;
    }

    public respFromLocal(){
        var gold:number = Common.gold - this.param.goldCost;
        var userInfo:SUserInfo = Common.userInfo.cloneAddExpServerInfo(this.param.addExp);
        var json:any = {
            gold:gold,
            userInfo:userInfo
        };
        return this.parse(json);
    }


    private parse(obj:any):MessageBase{
        this.resp = SCSlot.parse(obj);
        return this;
    }

    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}
