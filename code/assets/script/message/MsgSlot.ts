import MessageBase from "../core/net/MessageBase";
import NetConst from "../NetConst";
import { Common } from "../CommonData";
import { SUserInfo, SResInfo } from "./MsgLogin";

export class CSSlot{
    public costLife:number = 0;
    public addExp:number = 0;
}
export class SCSlot{
    public resInfo:SResInfo = null;
    public userInfo:SUserInfo = null;

    public static parse(obj:any):SCSlot{
        var info:SCSlot = new SCSlot();
        info.resInfo = SResInfo.parse(obj.resInfo);
        info.userInfo = SUserInfo.parse(obj.userInfo);
        return info;
    }
}
export default class MsgSlot extends MessageBase {
    public param:CSSlot;
    public resp:SCSlot;

    constructor(){
        super(NetConst.Slot);
        // this.isLocal = true;
    }

    public static create(cost:number,addExp:number){
        var msg = new MsgSlot();
        msg.param = new CSSlot();
        msg.param.costLife = cost;
        msg.param.addExp = addExp;
        return msg;
    }

    public respFromLocal(){
        var resInfo:SResInfo = Common.resInfo.cloneServerInfo();
        resInfo.life -= this.param.costLife;
        var userInfo:SUserInfo = Common.userInfo.cloneAddExpServerInfo(this.param.addExp);
        var json:any = {
            resInfo:resInfo
            ,userInfo:userInfo
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
