import ButtonEffect from "../component/ButtonEffect";
import { SceneCont } from "../GlobalData";
import { SOUND } from "../component/SoundManager";

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
export default class FarmScene extends cc.Component {


    @property(cc.Button) btnToSlot: cc.Button = null;

    @property(cc.Node) sceneNode: cc.Node = null;
    @property(cc.Node) sprTrans: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.moveInAction(()=>{
            SOUND.playFarmBgSound();
        });
    }

    onEnable(){
        this.initScene();
    }


    onDisable(){
        this.clearScene();
    }

    private initScene(){

        this.btnToSlot.node.on(ButtonEffect.CLICK_END,this.onGoSlot,this);
    }

    private clearScene(){

        this.btnToSlot.node.off(ButtonEffect.CLICK_END,this.onGoSlot,this);
    }

    private onGoSlot(e){
        this.btnToSlot.node.off(ButtonEffect.CLICK_END,this.onGoSlot,this);
        //去转盘
        cc.director.preloadScene(SceneCont.SlotScene,()=>{
            this.sceneNode.runAction(
                cc.sequence(cc.moveBy(0.15,cc.v2(this.sprTrans.width,0)).easing(cc.easeIn(1.5)),
                cc.callFunc(()=>{
                    cc.director.loadScene(SceneCont.SlotScene);
                }))
            )
        });
    }

    private moveInAction(cb:Function){
        this.sceneNode.x = this.sprTrans.width;
        this.sceneNode.runAction(
            cc.sequence(cc.moveBy(0.15,cc.v2(-this.sprTrans.width,0)).easing(cc.easeOut(1.5)),
            cc.callFunc(cb))
        );
    }

    // update (dt) {}
}
