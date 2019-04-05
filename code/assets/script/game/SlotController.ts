import SlotMachine, { SlotMachineState } from "./SlotMachine";
import SlotInput from "./SlotInput";

export enum SlotFruit{
    xigua = 1,      //西瓜
    lanmei  =2,        //蓝莓
    ningmeng =3,       //柠檬
    xiangjiao =4,      //香蕉
    yingtao =5,        //樱桃
    chengzi =6,        //橙子
    guopan =7,         //果盘
    guolan=8,         //果篮
    shoutao=9,        //手套
}
export default class SlotContoller {
    private static _instance: SlotContoller = null;
    public static getInstance(): SlotContoller {
        if (SlotContoller._instance == null) {
            SlotContoller._instance = new SlotContoller();
            
        }
        return SlotContoller._instance;
    }

    private _slotMachine:SlotMachine = null;

    public excute(input:SlotInput){
        if(this._slotMachine == null){
            this._slotMachine = new SlotMachine(SlotMachineState.normal);
        }

        this._slotMachine.excute(input);
    }
}

export var Slot:SlotContoller = SlotContoller.getInstance();
