import DList from "./DList";

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
export default class rank extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    @property(DList) list:DList = null;


    // @property(cc.Label) test:cc.Label = null;
    // onLoad () {}

    start () {
        window["wx"].onMessage( data => {
            switch(data.messageId){
                case 1: //showRankList
                {
                    // this.test.string ="showRankList";
                    console.log("showRanklist");
                    this.showRankList();
                }break;
            }
        });
    }

    private sortData(a:any,b:any):number{
        var levelA = Number((a.KVDataList)[0].value);
        var levelB = Number((b.KVDataList)[0].value);
        return (levelA > levelB)?-1:((levelA<levelB)?1:0);        
    }
    private showRankList(){
        var self = this;
        window["wx"].getFriendCloudStorage({
            keyList:["level","duty"],
            success:function(res){
                console.log("getFriendCloudStorage success");
                console.log(res.data);
                var newData = res.data.sort(self.sortData);
                console.log(newData);
                self.list.setListData(newData);
            },
            fail:function(res){
                console.log("getFriendCloudStorage failed");
                console.log(res);
            }
        })
    }
    // update (dt) {}
}
