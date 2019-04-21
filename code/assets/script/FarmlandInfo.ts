import { SFarmlandInfo } from "./message/MsgLogin";

export default class FarmlandInfo{
    
    //地格索引
    public index:number = 0 ;
    //typeid
    public treeType:number =0;
    // //采摘次数
    // public pickTimes:number = 0;

    //生长时间
    public growthStartTime:number = 0;

    public initFromServer(stree:SFarmlandInfo){
        this.index = stree.index;
        this.treeType = stree.treeType;
        // this.pickTimes = stree.pickTimes;
        this.growthStartTime = stree.growthStartTime;
    }
    // public updateServer(stree:SFarmlandInfo){
    //     this.pickTimes = stree.pickTimes;
    //     this.growthTime = 0;
    // }

    public cloneServerInfo():SFarmlandInfo{
        var info:SFarmlandInfo = new SFarmlandInfo();
        info.index = this.index;
        info.treeType = this.treeType;
        // info.pickTimes = this.pickTimes;
        info.growthStartTime = this.growthStartTime;
        return info;
    }
}
