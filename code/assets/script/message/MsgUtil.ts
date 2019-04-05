import MessageBase from "../core/net/MessageBase";
import NetConst from "../NetConst";
import MsgLogin from "./MsgLogin";
import MsgHeartBeat from "./MsgHeartBeat";

/**
 * 太特么坑了，父类中还不能导入子类
 */
export default class MsgUtil{
    
    //创建response message
    public static createMessage(id:number):MessageBase{
        var message:MessageBase = null;
        switch(id){
            case NetConst.Login:{
                message = new MsgLogin();
            }break;
            case NetConst.Heart:
                message = new MsgHeartBeat();
            break;
            default:
            message = null;
            break;
        }
        return message;
    }
}