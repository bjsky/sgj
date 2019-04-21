import MessageBase from "../core/net/MessageBase";
import NetConst from "../NetConst";
import { SResInfo } from "./MsgLogin";

//资源类型
export enum ResType{
    Gold = 1,       //金币
    Water = 2,      //水滴
}
export class CSAddRes{
    //增加资源
    public addType:ResType = 0;
    //数量
    public addNum:number = 0;
}

//增加资源
export class SCAddRes{
    //资源信息
    public resInfo:SResInfo = null;
    
    public static parse(obj:any):SCAddRes{
        var info:SCAddRes = new SCAddRes();
        info.resInfo = SResInfo.parse(obj.resInfo);
        return info;
    }
}
export default class MsgAddRes extends MessageBase {
    public param:CSAddRes;
    public resp:SCAddRes;

    constructor(){
        super(NetConst.ShareWater);
        // this.isLocal = true;
    }

    public static create(add:number){
        var msg = new MsgAddRes();
        msg.param = new CSAddRes();
        msg.param.addType = ResType.Water;
        msg.param.addNum = add;
        return msg;
    }

    public respFromLocal(){
        var json:any = {};
        return this.parse(json);
    }


    private parse(obj:any):MessageBase{
        this.resp = SCAddRes.parse(obj);
        return this;
    }

    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}
