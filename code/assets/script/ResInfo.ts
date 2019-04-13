import { SResInfo } from "./message/MsgLogin";

export default class ResInfo {
    //精力
    public energy:number = 0;
    //精力开始时间
    public energyStartTime:number = 0;
    //当前经验
    public gold:number = 0;

    public initFormServer(sInfo:SResInfo){
        this.energy = sInfo.energy;
        this.energyStartTime = sInfo.energyStartTime;
        this.gold = sInfo.gold;
    }

    public updateInfo(sInfo:SResInfo){
        this.initFormServer(sInfo);
    }

    public cloneServerInfo():SResInfo{
        var sInfo:SResInfo = new SResInfo();
        sInfo.energy = this.energy;
        sInfo.energyStartTime = this.energyStartTime;
        sInfo.gold = this.gold;
        return sInfo;
    }
}
