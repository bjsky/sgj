import PopUpBase from "../component/PopUpBase";

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
export enum GetGoldViewType{
    getGold = 1,
    share = 2,
}

@ccclass
export default class GetGold extends PopUpBase {

    @property(cc.RichText)
    content: cc.RichText = null;
    @property(cc.Button)
    btnSeevideo: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.content.string ='';
    }

    private _type:GetGoldViewType = 0;
    public setData(data:any){
        this._type = data.type;
    }

    onEnable(){
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
    protected onShowComplete(){
        if(this._type == GetGoldViewType.getGold){
            this.content.string = "<color=#ffffff>金币不够买种子了</c>";
        }
    }
    start () {

    }

    // update (dt) {}
}
