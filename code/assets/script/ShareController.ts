import { Global, ServerType } from "./GlobalData";
import { Common } from "./CommonData";
import { Wechat } from "./WeChatInterface";

export default class ShareController{

    private static _instance: ShareController = null;
    public static getInstance(): ShareController {
        if (ShareController._instance == null) {
            ShareController._instance = new ShareController();
            
        }
        return ShareController._instance;
    }
    private _shareSuccessCB:Function = null;
    private _shareFailCb:Function = null;
    private _shareOnHideTime:number = 0;
    public get isShareOnHide(){
        return this._shareOnHideTime>0;
    }
    //分享链接
    public shareAppMessage(success:Function,fail:Function){
        this._shareSuccessCB = success;
        this._shareFailCb =fail;
        if(Global.serverType == ServerType.Publish){
            var title:string ="点一点，摇金币，水果大王就是你";
            var imgUrl:string ="https://www.xh52.top/resShare/share_1.jpg";
            var query:string ="";
            
            this._shareOnHideTime = Common.getServerTime();
            console.log("share on hide:",this._shareOnHideTime);
            Wechat.shareAppMessage(title,imgUrl,query);
        }else if(Global.serverType == ServerType.Debug||
            Global.serverType == ServerType.Client){
            this.onShareFinish(true);
        }
    }

    private onShareFinish(success:boolean ){
        if(success){
            this._shareSuccessCB && this._shareSuccessCB();
        }else{
            this._shareFailCb && this._shareFailCb();
        }
        
        this._shareSuccessCB = null;
        this._shareFailCb = null;
        this._shareOnHideTime =0;
    }

    public shareOnShow(){
        var time :number = Common.getServerTime();
        console.log("share on show:",time);
        if(time - this._shareOnHideTime>3000){
            this.onShareFinish(true);
        }else{
            this.onShareFinish(false);
        }
    }

    public shareGetGold(addGold:number){

    }
}

export var Share :ShareController = ShareController.getInstance();