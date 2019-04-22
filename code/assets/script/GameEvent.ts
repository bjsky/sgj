
export default class GameEvent {
    //遮罩点击
    public static Mask_touch:string = "Mask_touch";
    //所有弹窗关闭
    public static PopUp_AllClosed:string ="PopUp_AllClosed";

    //回到游戏
    public static Weixin_onShow:string ="Weixin_onShow";
    //隐藏游戏
    public static Weixin_onHide:string ="Weixin_onHide";
    //加载完成
    public static Loading_complete:string = "Loading_complete";
    //播放轮盘
    public static Play_Slot:string ="Play_Slot";
    //显示经验效果
    public static Show_Exp_Fly:string ="Show_Exp_Fly";
    public static Show_Exp_FlyEnd:string = "Show_Exp_FlyEnd";
    public static Show_Gold_Fly:string ="Show_Gold_Fly";
    //升级
    public static User_Level_UP:string = "User_Level_UP";
    //关闭升级界面
    public static UpgreadUI_Closed:string ="UpgreadUI_Closed";

    //大奖开始
    public static BigWin_Start:string ="BigWin_Start";
    //大奖更新轮次
    public static BigWin_updateTurn:string = "BigWin_updateTurn";
    //大奖结束
    public static BigWin_End:string ="BigWin_End";
    //种植树
    public static Plant_Tree:string ="Plant_Tree";
    //更新树
    public static Update_Tree:string ="Update_Tree";
    //移除树
    public static Remove_Tree:string ="Remove_Tree";
    //采摘动画完成
    public static Pick_Tree_Fly_End:string ="Pick_Tree_Fly_End";
    //场景切换
    public static Scene_To_Slot:string ="Scene_To_Slot";
    public static Scene_To_Farm:string ="Scene_To_Farm";
    //免费种植改变
    public static Plant_Free_Change:string="Plant_Free_Change";
    //更新解锁
    public static Update_Unlock_Farmland:string ="Update_Unlock_Farmland";
    //获得资源更新
    public static Get_Res_Finish:string ="Get_Res_Finish";
}
