import { SResInfo } from "./message/MsgLogin";

export default class ResInfo {
    //体力
    public life:number = 0;
    //当前经验
    public gold:number = 0;

    public initFormServer(sInfo:SResInfo){
        this.life = sInfo.life;
        this.gold = sInfo.gold;
    }
    public updateInfo(sInfo:SResInfo){
        this.initFormServer(sInfo);
    }

    public cloneServerInfo():SResInfo{
        var sInfo:SResInfo = new SResInfo();
        sInfo.life = this.life;
        sInfo.gold = this.gold;
        return sInfo;
    }
}
