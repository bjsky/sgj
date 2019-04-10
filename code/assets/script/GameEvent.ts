
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
}
