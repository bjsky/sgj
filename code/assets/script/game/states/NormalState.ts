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

export default class NormalState extends SlotState{

    constructor(state:SlotMachineState, machine:SlotMachine){
        super(state,machine);

        this._normalFruitArr = [];
        var fruitCfg:any = CFG.getCfgGroup(ConfigConst.Fruit);
        for(var key in fruitCfg){
            var fruit:any = fruitCfg[key];
            if(fruit.isBigWin == "1"){
                continue;
            }
            this._normalFruitArr.push(fruit);
        }
    }

    public excute(input:SlotInput){
        if(input.type == SlotInputEnum.startPlay){
            var startIn:SlotInputStart = input as SlotInputStart;

            var result = this.getNormalResult(this._normalFruitArr);
            if(result.type == SlotWinEnum.Repeat){
                var reslut2:SlotWin;
                do{
                    reslut2 = this.getNormalResult(this._normalFruitArr);
                }while(reslut2.type== SlotWinEnum.Repeat);
                result.type = SlotWinEnum.Repeat;
                result.slotArr = reslut2.slotArr;
            }
            result.cost = startIn.cost;
            EVENT.emit(GameEvent.Play_Slot,result);
    
            NET.send(MsgSlot.create(startIn.cost,startIn.cost),(msg:MsgSlot)=>{
                if(msg && msg.resp){
                    Common.updateUserInfo(msg.resp.userInfo);
                    Common.gold = msg.resp.gold;
                    EVENT.emit(GameEvent.Show_Exp_Fly);
                }
            },this);
        }
    }
    private _normalFruitArr:Array<any> = [];
    private getNormalResult(fruitArr:Array<any>):SlotWin{
        var result:SlotWin;
        var isWin:boolean = false;
        var winRate :number = Number(CFG.getCfgByKey(ConfigConst.Constant,"key","fruitWin")[0].value);
        if(Math.random()<winRate){
            isWin = true;
        }
        var fruitIdArr:Array<number> = []
        if(isWin){  //赢
            var winFruitId:number = NumUtil.getRandomFruit(fruitArr);
            if(winFruitId == SlotFruit.shoutao){
                result = new SlotWin(SlotWinEnum.Repeat);
            }else{
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
    
}
