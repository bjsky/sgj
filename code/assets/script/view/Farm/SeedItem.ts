import DListItem from "../../component/DListItem";
import LoadSprite from "../../component/LoadSprite";
import PathUtil from "../../utils/PathUtil";
import { Common } from "../../CommonData";
import { CFG } from "../../core/ConfigManager";
import { ConfigConst } from "../../GlobalData";
import ButtonEffect from "../../component/ButtonEffect";
import FarmController, { Farm } from "../../game/farm/FarmController";
import DList from "../../component/DList";
import { UI } from "../../core/UIManager";

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
export default class SeedItem extends DListItem{
    @property(LoadSprite) sprFruit:LoadSprite = null;
    @property(cc.Label) lblSeedName:cc.Label = null;
    @property(cc.Label) lblSeedCost:cc.Label = null;
    @property(cc.Label) lblLockLv:cc.Label = null;
    @property(cc.Node) nodeLock:cc.Node = null;
    @property(cc.Node) nodeunLock:cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _seedId:number = 0;
    private _seedName:string = "";
    private _unlockLv:number = 0;
    private _cost:number = 0;
    private _icon:string =""
    public setData(data:any){
        super.setData(data);
        this._seedId = Number(data.id);
        this._seedName = data.name;
        this._unlockLv = Number(data.unlocklv);
        this._cost = Number(data.plantcost);
        this._icon = data.icon;
    }
    onEnable(){
        super.onEnable();
        this.nodeLock.active = this.nodeunLock.active = false;
        this.lblSeedName.string = this._seedName;
        this.sprFruit.load(this._icon);
        if(Common.userInfo.level>= this._unlockLv){
            this.nodeunLock.active = true;
            this.lblSeedCost.string = this._cost.toString();
        }else{
            this.nodeLock.active = true;
            var title:string = CFG.getCfgDataById(ConfigConst.Level,this._unlockLv).title;
            this.lblLockLv.string =title +"\n解锁";
        }
    }

    onDisable(){
        super.onDisable();
    }

    protected onNodeTouch(e){
        if(Common.userInfo.level<this._unlockLv){
            var title:string = CFG.getCfgDataById(ConfigConst.Level,this._unlockLv).title;
            UI.showTip(title + " 解锁");
            return;
        }
        if(Common.resInfo.gold<this._cost){
            UI.showTip("金币不足");
            return;
        }
        
        this.list.node.emit(DList.ITEM_CLICK,{index:this.index,data:this._data});
        if(this.index!=this.list.selectIndex){
            this.list.selectIndex = this.index;
            this.list.node.emit(DList.ITEM_SELECT_CHANGE,{index:this.index,data:this._data});
        }
    }
    start () {

    }

    // update (dt) {}
}