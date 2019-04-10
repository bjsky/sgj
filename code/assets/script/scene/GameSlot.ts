import GameScene from "./GameScene";
import SlotView from "../game/SlotView";
import SlotWin, { SlotWinEnum } from "../game/SlotWin";
import { SlotResultAnim, SlotResultAniEnum} from "../view/AnimUi";
import { SlotFruit } from "../game/SlotController";
import { CFG } from "../core/ConfigManager";
import { ConfigConst } from "../GlobalData";
import { UI } from "../core/UIManager";
import SlotNode from "../game/SlotNode";
import GameEvent from "../GameEvent";
import { EVENT } from "../core/EventController";
import { SOUND } from "../component/SoundManager";

export default class GameSlot{

    private _scene:GameScene;
    constructor(scene:GameScene){
        this._scene = scene;
    }

    private _slotView1:SlotView;
    private _slotView2:SlotView;
    private _slotView3:SlotView;

    private _slot:SlotNode;

    public initSlotView(slot1:SlotView,slot2:SlotView,slot3:SlotView){
        this._slotView1 = slot1;
        // this._slotView1.initFruit();
        this._slotView2 = slot2;
        // this._slotView2.initFruit();
        this._slotView3 = slot3;
        // this._slotView3.initFruit();
    }
    public initSlotView2(slotNode:SlotNode){
        this._slot = slotNode;
        this._slot.initFruit();
    }

    public playSlotView(result:SlotWin,cb:Function){
        var slotArr:Array<number> = result.slotArr;
        var winAnim:SlotResultAnim = null;
        if(result.type == SlotWinEnum.Normal){
            winAnim = new SlotResultAnim(SlotResultAniEnum.Hevart);
            winAnim.coinTo = this._scene.coinIcon.parent.convertToWorldSpaceAR(this._scene.coinIcon.position);
            var fruitCfg:any = CFG.getCfgDataById(ConfigConst.Fruit,slotArr[0]);
            winAnim.muti = Number(fruitCfg.winMuti);
            winAnim.flyCoin = Number(fruitCfg.flyCoin);
            winAnim.addGold = winAnim.muti * result.cost;
        }
        if(result.type == SlotWinEnum.Normal){
            this.playSlotViewResult(result.slotArr,winAnim,cb);
        }else if(result.type== SlotWinEnum.Repeat){
            this.playSlotViewRepeat(result,cb);
        }else if(result.type == SlotWinEnum.BigWin){
            this.playSlotViewBigWin(result,cb);
        }
        else{
            cb && cb();
        }
    }

    public playSlotViewResult(slotArr:Array<number> ,anim:SlotResultAnim,cb:Function){
        // this._slotView1.play(Number(slotArr[0]),0.6);
        // this._slotView2.play(Number(slotArr[1]),0.8);
        // this._slotView3.play(Number(slotArr[2]),1);
        // if(anim!=null){
        //     this._scene.scheduleOnce(()=>{
        //         UI.showWinAnim(anim);
        //     },1);
        //     this._scene.scheduleOnce(()=>{
        //         cb && cb();
        //     },1.5)
        // }else{
        //     this._scene.scheduleOnce(()=>{
        //         cb && cb();
        //     },1)
        // }
        var id:number = slotArr[0];
        this._slot.play(id);
        if(anim!=null){
                this._scene.scheduleOnce(()=>{
                    UI.showWinAnim(anim);
                },2);
                this._scene.scheduleOnce(()=>{
                    cb && cb();
                },2.5)
            }else{
                this._scene.scheduleOnce(()=>{
                    cb && cb();
                },2)
        }
    }

    public playSlotViewRepeat(result:SlotWin,cb:Function){
        var slotArr:Array<number> = result.slotArr;
        // this._slotView1.play(SlotFruit.shoutao,0.6);
        // this._slotView2.play(SlotFruit.shoutao,0.8);
        // this._slotView3.play(SlotFruit.shoutao,1);
        // this._scene.scheduleOnce(()=>{
        //     UI.showWinAnim(new SlotResultAnim(SlotResultAniEnum.Repeat));
        // },1);
        // this._scene.scheduleOnce(()=>{
        //     result.type = SlotWinEnum.Normal;
        //     this.playSlotView(result,cb);
        // },1.5)
        this._slot.play(SlotFruit.shoutao);
        this._scene.scheduleOnce(()=>{
            UI.showWinAnim(new SlotResultAnim(SlotResultAniEnum.Repeat));
        },2);
        this._scene.scheduleOnce(()=>{
            var repeat:SlotWin = result.repeatSlotWin;
            repeat.cost = result.cost;
            this.playSlotView(repeat,cb);
        },2.5)
    }

    public playSlotViewBigWin(result:SlotWin,cb:Function){
        this._slot.play(SlotFruit.guolan);
        this._scene.scheduleOnce(()=>{
            UI.showWinAnim(new SlotResultAnim(SlotResultAniEnum.BigWin));
            EVENT.emit(GameEvent.BigWin_Start);
        },2);
        var i:number = 0;
        for(var i:number = 0;i<=result.bigwinSlotWin.length;i++){
            this._scene.scheduleOnce(()=>{
                if(result.bigwinSlotWin.length>0){
                    var bigwin:SlotWin = result.bigwinSlotWin.shift();
                    bigwin.cost = result.cost;
                    this.playSlotView(bigwin,null);
                    EVENT.emit(GameEvent.BigWin_updateTurn);
                }else{
                    SOUND.playBgSound();
                    EVENT.emit(GameEvent.BigWin_End);
                    cb && cb();
                }
            },(i+1)*3.5)
        }
    }

}
