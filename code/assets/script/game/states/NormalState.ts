import SlotState from "../SlotState";
import SlotMachine, { SlotMachineState } from "../SlotMachine";
import { CFG } from "../../core/ConfigManager";
import { ConfigConst } from "../../GlobalData";
import NumUtil from "../../utils/NumUtil";
import { EVENT } from "../../core/EventController";
import GameEvent from "../../GameEvent";
import { SlotFruit } from "../SlotController";
import SlotInput, { SlotInputStart, SlotInputEnum } from "../SlotInput";
import { NET } from "../../core/net/NetController";
import MsgSlot from "../../message/MsgSlot";
import { Common } from "../../CommonData";
import SlotWin, { SlotWinEnum } from "../SlotWin";
import { SResInfo } from "../../message/MsgLogin";

export default class NormalState extends SlotState{

    constructor(state:SlotMachineState, machine:SlotMachine){
        super(state,machine);

        this._normalFruitArr = [];
        this._bigwinFruitArr = [];
        var fruitCfg:any = CFG.getCfgGroup(ConfigConst.Fruit);
        for(var key in fruitCfg){
            var fruit:any = fruitCfg[key];
            if(fruit.use == "1"){
                this._normalFruitArr.push(fruit);
                if(fruit.isBig == "1"){
                    this._bigwinFruitArr.push(fruit);
                }
            }
        }
    }

    public excute(input:SlotInput){
        if(input.type == SlotInputEnum.startPlay){
            var startIn:SlotInputStart = input as SlotInputStart;

            var result = this.getNormalResult(this._normalFruitArr);
            result.cost = startIn.cost;
            EVENT.emit(GameEvent.Play_Slot,result);
    
            NET.send(MsgSlot.create(startIn.cost,startIn.cost),(msg:MsgSlot)=>{
                if(msg && msg.resp){
                    Common.updateUserInfo(msg.resp.userInfo);
                    Common.resInfo.initFormServer( msg.resp.resInfo);
                    EVENT.emit(GameEvent.Show_Exp_Fly);
                }
            },this);
        }
    }
    private _normalFruitArr:Array<any> = [];
    private _bigwinFruitArr:Array<number> = [];
    private getNormalResult(fruitArr:Array<any>):SlotWin{
        var result:SlotWin;
        var isWin:boolean = false;
        var winRate :number = Number(CFG.getCfgByKey(ConfigConst.Constant,"key","fruitWin")[0].value);
        if(true){
            isWin = true;
        }
        var fruitIdArr:Array<number> = []
        if(isWin){  //赢
            var winFruitId:number = NumUtil.getRandomFruit(fruitArr);
            console.log("____"+winFruitId);
            if(winFruitId == SlotFruit.repeat){
                result = new SlotWin(SlotWinEnum.Repeat);
                var reslut2:SlotWin;
                do{
                    reslut2 = this.getNormalResult(this._normalFruitArr);
                }while(reslut2.type== SlotWinEnum.Repeat);
                result.repeatSlotWin = reslut2;
                
            }else if(winFruitId == SlotFruit.guolan){
                result = new SlotWin(SlotWinEnum.BigWin);
                result.slotArr = [winFruitId,winFruitId,winFruitId];
                result.bigwinSlotWin =[];
                var turn:number = Number(CFG.getCfgByKey(ConfigConst.Constant,"key","bigWinRound")[0].value);
                for(var i:number = 0;i<turn;i++){
                    var bigwin = this.getBigwinReslut(this._bigwinFruitArr);
                    result.bigwinSlotWin.push(bigwin);
                }
            }else if(winFruitId == SlotFruit.share){        //分享得金币
                result = new SlotWin(SlotWinEnum.Share);
                result.slotArr = [winFruitId,winFruitId,winFruitId];
            }
            else{
                fruitIdArr =[winFruitId,winFruitId,winFruitId];
                result = new SlotWin(SlotWinEnum.Normal);
                result.slotArr = fruitIdArr;
            }
        }else{  //不赢
            var index1:number = NumUtil.randomIndex(fruitArr.length);
            var fruitId1:number = Number(fruitArr[index1].id);
            var fruitId2:number = Number(fruitArr[NumUtil.randomIndex(fruitArr.length)].id);
            var fruitId3:number = 0;
            if(fruitId1!=fruitId2){
                fruitId3 = Number(fruitArr[NumUtil.randomIndex(fruitArr.length)].id);
            }else{
                var arr:Array<any> = fruitArr.slice();
                arr.splice(index1,1);
                var fruitId3:number = Number(arr[NumUtil.randomIndex(arr.length)].id);
            }
            fruitIdArr =[fruitId1,fruitId2,fruitId3];
            result = new SlotWin(SlotWinEnum.Normal);
            result.slotArr = fruitIdArr;
        }
        console.log(fruitIdArr.toString());
        return result;
    }

    private getBigwinReslut(fruitArr:Array<any>):SlotWin{
        var bigwinFruitId :number = NumUtil.getRandomFruit(fruitArr);
        var bigwin:SlotWin = new SlotWin(SlotWinEnum.Normal);
        bigwin.slotArr = [bigwinFruitId,bigwinFruitId,bigwinFruitId];
        return bigwin;
    }
}
