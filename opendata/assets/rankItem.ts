import DListItem from "./DListItem";

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
export default class rankItem extends DListItem {

    @property(cc.Sprite) sprHead:cc.Sprite = null;
    @property(cc.Label) nickname:cc.Label = null;
    @property(cc.Label) lblLv:cc.Label = null;
    @property(cc.Label) lblDuty:cc.Label = null;
    

    // onLoad () {}
    private _kvData:any =null;
    private _avatarUrl:string = "";
    private _nickName:string = "";
    public setData(data:any){
        super.setData(data);
        console.log("item:",data);
        this._kvData = data.KVDataList;
        this._avatarUrl = data.avatarUrl;
        this._nickName = data.nickname;
    }


    onEnable(){
        this.nickname.string = this._nickName;
        this.lblLv.string ='Lv.'+this._kvData[0].value;
        this.lblDuty.string = this._kvData[1].value;
        var self = this;
        cc.loader.load({url:this._avatarUrl,type:"png"},function(err,textrue){
            if(err) console.error(err);
            self.sprHead.spriteFrame = new cc.SpriteFrame(textrue);
            self.sprHead.node.width = 90;
            self.sprHead.node.height = 90;
        })
    }

    onDisable(){

    }
    start () {

    }

    // update (dt) {}
}
