
import NetConst from "../NetConst";
import MessageBase from "../core/net/MessageBase";
import StringUtil from "../utils/StringUtil";

/**
 * 登录客户端数据
 */
export class CSLoginData {
    public accountId:string;   //账号id
    public code:string;  //微信code
    public adId:string;
    public shareId:string;
    public name:string;
    public icon:string;
    public gender:number;   
}

/**
 * 登录服务器数据
 */
export class SCLoginData {
    public accountId:string //账号id
    //新账户
    public newUser:number = 0;
    //每天首次登录
    public firstLogin:boolean  = false;
    //服务器时间
    public serverTime:number = 0;
    //用户信息
    public userInfo:SUserInfo = null;
    //资源信息
    public resInfo:SResInfo = null;

    public static parse(obj:any):SCLoginData{
        var data:SCLoginData = new SCLoginData();
        data.accountId = obj.accountId;
        data.newUser = obj.newUser;
        data.firstLogin = obj.firstLogin;
        data.serverTime = obj.serverTime;
        data.userInfo = SUserInfo.parse(obj.userInfo);
        data.resInfo = SResInfo.parse(obj.resInfo);
        return data;
    }
}

export class SUserInfo {
    //用户名
    public name:string = "";
    //头像url
    public icon:string = "";
    //性别
    public gender:number = 0;
    //当前经验
    public exp:number = 0;
    //总经验
    public totalExp:number = 0;
    //当前等级
    public level:number = 1;

    public static parse(obj:any):SUserInfo{
        var info:SUserInfo = new SUserInfo();
        info.name = obj.name;
        info.icon = obj.icon;
        info.gender = obj.gender;
        info.exp = obj.exp;
        info.totalExp = obj.totalExp;
        info.level = obj.level;

        return info;
    }
}

export class SResInfo{
    //金币
    public gold:number = 0;

    public life:number = 0;

    public static parse(obj:any):SResInfo{
        var info:SResInfo = new SResInfo();
        info.gold = obj.gold;
        info.life = obj.life;
        return info;
    }
}
export default class MsgLogin
 extends MessageBase {
    public param:CSLoginData;
    public resp:SCLoginData;

    constructor(){
        super(NetConst.Login);
        // this.isLocal = true;
    }

    public static create(accountId:string,code:string,userInfo:any = null
        ,shareId:string="",adId:string=""){
        var msg = new MsgLogin();
        msg.param = new CSLoginData();
        msg.param.accountId = accountId;
        msg.param.code = code;
        console.log("MsgLogin create:",userInfo)
        if(userInfo!=null){
            msg.param.name = userInfo.nickName;
            msg.param.icon = userInfo.avatarUrl;
            msg.param.gender = userInfo.gender;
        }
        msg.param.shareId = shareId;
        msg.param.adId = adId;
        return msg;
    }

    public respFromLocal(){
        var json:any = {firstLogin:true,
            accountId:StringUtil.getUUidClient(),
            newUser:0,
            serverTime:new Date().getTime(),
            userInfo:{name:"开心农场",icon:"",gender:1,exp:0,totalExp:0,level:1},
            resInfo:{gold:0,life:4500},
        };
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        var data:SCLoginData = SCLoginData.parse(obj);
        this.resp = data;
        return this;
    }

    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}