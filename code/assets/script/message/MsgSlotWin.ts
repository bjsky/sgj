import MessageBase from "../core/net/MessageBase";
import NetConst from "../NetConst";
import { SUserInfo } from "./MsgLogin";
import { Common } from "../CommonData";

export class CSSlotWin{
    public addGold:number;
}

export class SCSlotWin{
    public gold:number = 0;

    public static parse(obj:any):SCSlotWin{
        var info:SCSlotWin = new SCSlotWin();
        info.gold = Number(obj.gold);
        return info;
    }
}

export default class MsgSlotWin extends MessageBase {
    public param:CSSlotWin;
    public resp:SCSlotWin;

    constructor(){
        super(NetConst.SlotWin);
        // this.isLocal = true;
    }

    public static create(gold:number){
        var msg = new MsgSlotWin();
        msg.param = new CSSlotWin();
        msg.param.addGold = gold;
        return msg;
    }
    public respFromLocal(){
        var gold:number = Common.gold + this.param.addGold;
        var json:any = {
            gold:gold
        };
        return this.parse(json);
    }


    private parse(obj:any):MessageBase{
        this.resp = SCSlotWin.parse(obj);
        return this;
    }

    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}
