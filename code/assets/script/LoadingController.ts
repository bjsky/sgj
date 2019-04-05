import { Global, ServerType, ConfigConst } from "./GlobalData";
import { RES } from "./core/ResourceManager";
import { CFG } from "./core/ConfigManager";
import { NET } from "./core/net/NetController";
import MsgLogin from "./message/MsgLogin";
import { Common } from "./CommonData";

export default class LoadingController {
    private static _instance: LoadingController = null;
    public static getInstance(): LoadingController {
        if (LoadingController._instance == null) {
            LoadingController._instance = new LoadingController();
            
        }
        return LoadingController._instance;
    }
    

    private _onComplteCb:Function = null;
    public startLoading(onCompleteCb:Function){
        this._onComplteCb = onCompleteCb;

        if(Global.serverType == ServerType.Client){
            new ConfigLoading().start(this._onComplteCb);
        }

    }
}

export class ConfigLoading{

    private _cfgArr:string[];
    private _completeCb:Function = null;
    public start(completeCb:Function){
        this._completeCb = completeCb;
        this._cfgArr = [];
        for(var key in ConfigConst){
            this._cfgArr.push(ConfigConst[key]);
        }

        RES.load(this._cfgArr,this.loadConfigComplete.bind(this),this.loadConfigProgress.bind(this),this.loadConfigFailed.bind(this));   
    }
    private loadConfigComplete(resArr:any){
        resArr.forEach(res => {
            CFG.parseCfg(res,RES.get(res));
        });

        console.log("Config loaded!");
        new LoginServer().start(this._completeCb);
    }
    private loadConfigProgress(pro:number){

    }
    private loadConfigFailed(msg:string){
        console.log("config load failed!",msg);
    }
}

export class LoginServer{
    private _completeCb:Function = null;
    public start(completeCb:Function){
        this._completeCb = completeCb;

        NET.send(MsgLogin.create("",""),(msg:MsgLogin)=>{
            if(msg && msg.resp){
                console.log(msg.resp);
            }
            Common.initFromServer(msg.resp);
            this._completeCb && this._completeCb();
        },this)
    }
}

export var Loading:LoadingController = LoadingController.getInstance();