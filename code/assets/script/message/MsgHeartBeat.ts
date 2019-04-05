import NetConst from "../NetConst";
import MessageBase from "../core/net/MessageBase";

export default class MsgHeartBeat extends MessageBase{
    public param:any;
    public resp:any;

    constructor(){
        super(NetConst.Heart);
        // this.isLocal = true;
    }

    public static create(){
        var msg = new MsgHeartBeat();
        msg.param = {};
        return msg;
    }
    public respFromServer(obj:any):MessageBase{
        this.resp = {};
        return this;
    }
}