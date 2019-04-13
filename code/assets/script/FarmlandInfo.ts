import { SFarmlandInfo } from "./message/MsgLogin";

export default class FarmlandInfo{
    
    //地格索引
    public index:number = 0 ;
    //唯一id
    public treeUid:string = "";
    //typeid
    public treeType:number =0;
    //采摘次数
    public pickTimes:number = 0;

    public initFromServer(stree:SFarmlandInfo){
        this.index = stree.index;
        this.treeUid = stree.treeUid;
        this.treeType = stree.treeType;
        this.pickTimes = stree.pickTimes;
    }
}
