import DList, { DListDirection } from "./DList";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DListItem extends cc.Component {


    private _select:boolean = false;
    public set select(val){
        this._select = val;
        this.setSelect(this._select);
    }
    public get select(){
        return this._select;
    }
    public list :DList = null;
    public index:number = -1;

    protected _data:any = null;
    public setData(data:any){
        this._data = data;
    }

    public getData(){
        return this._data;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }
    protected setSelect(select:boolean){

    }
    //更新的处理
    onUpdate(completeCB?:Function){

    }

    //移除的处理
    onRemove(completeCB?:Function){

    }
    start () {

    }

    // update (dt) {}
}
