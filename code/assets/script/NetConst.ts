
export default class NetConst{
    public static NET_ConnectTimeOut:string = "-3";
    public static NET_CLOSE:string = "-2";
    public static NET_ERROR:string = "-4";
    public static ExceptionCmd :string = "-1";  
    public static NET_Connected:string = "0";
    public static NET_Connecting:string = "1";

    
    /**心跳 */
    public static Heart:number = 108;
    //登录
    public static Login:number = 10001;

    //抽奖
    public static Slot:number = 10002;
    //中奖
    public static SlotWin:number = 10003;
    //种植
    public static Plant:number = 10004;
    //收集
    public static Pick:number = 10005;
}
