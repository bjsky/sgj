


export enum SlotWinEnum{
    Normal = 1,       //普通
    Repeat = 2,     //再来一次
    BigWinReady,    //大奖锁定
    BigWin          //中大奖了
    
}
export default class SlotWin{
    constructor(type:SlotWinEnum){
        this.type = type;
    }
    public type:SlotWinEnum = 0;
    public slotArr:Array<number> = [];
    public cost:number = 0;
}