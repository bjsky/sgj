import { UI } from "./core/UIManager";
import { Wechat } from "./WeChatInterface";

export enum ServerType{
    //客户端测试 
    Client = 0,
    //服务器调试
    Debug ,
    //发布环境
    Publish
}
export const ConfigConst = {
    Constant:"configs/constant",
    Level:"configs/level",
    Fruit:"configs/fruit",
}
export const ResConst = {
    AlertPanel:"prefabs/alertPanel",
    TipPanel:"prefabs/tipPanel",
    WinAnim:"prefabs/animUi",
}
export default class GlobalData{

    private static _instance: GlobalData = null;
    public static getInstance(): GlobalData {
        if (GlobalData._instance == null) {
            GlobalData._instance = new GlobalData();
            
        }
        return GlobalData._instance;
    }

    public serverType:number = ServerType.Client;
    public version:string = "1.0.1";
    
    public isIPhoneX:boolean =false;
    public statusBarHeight:number = 0;
    public systemInfo:any =null;
    public initSystemInfo(){
        this.systemInfo = Wechat.getSystemInfo(); 
        console.log("initSystemInfo:"+JSON.stringify(this.systemInfo) );
        if(this.systemInfo && this.systemInfo.model.indexOf("iPhone X")>=0 )
        {
            this.isIPhoneX = true;
            this.statusBarHeight = Number(this.systemInfo.statusBarHeight);
            UI.adjustHeight();
        }
    }

}

export var Global:GlobalData = GlobalData.getInstance();
