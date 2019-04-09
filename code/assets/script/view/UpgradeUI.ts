import PopUpBase from "../component/PopUpBase";
import { Common } from "../CommonData";
import { CFG } from "../core/ConfigManager";
import { ConfigConst } from "../GlobalData";
import { EVENT } from "../core/EventController";
import GameEvent from "../GameEvent";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class UpgradeUI extends PopUpBase{

    @property(cc.Label)
    lblLv: cc.Label = null;
    @property(cc.RichText)
    lblUnlock: cc.RichText = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable(){
        super.onEnable();
        this.initView();
    }

    private initView(){
        var level:number = Common.userInfo.level;
        var levelCfg:any = CFG.getCfgDataById(ConfigConst.Level,level);
        if(levelCfg){
            this.lblLv.string = level.toString();
            
            var unlcokCostStr:string = "每分钟精力恢复：<color= #00ff00><b>"+levelCfg.lifeReturn+"</b></c><br />"+
                "精力恢复上限：<color= #00ff00><b>"+levelCfg.lifeMax+"</b></c><br />"+
                "种植精力消耗：<color= #00ff00><b>"+levelCfg.cost+"</b></c>";
            var unlocktitle:string ="";
            if(Number(levelCfg.unlcokTitle)==1){
                unlocktitle = "获得称号：<color = #00ff00><b>"+levelCfg.title+"</b></c>";
            }
            if(unlocktitle!=""){
                this.lblUnlock.string = "<color=#00FFF6>"+unlocktitle+"<br />"+unlcokCostStr+"</c>";
            }else{
                this.lblUnlock.string = "<color=#00FFF6>"+unlcokCostStr+"</c>";
            }
        }
    }
    onCloseComplete(){
        EVENT.emit(GameEvent.UpgreadUI_Closed);
        super.onCloseComplete();
    }

    start () {

    }

    // update (dt) {}
}
