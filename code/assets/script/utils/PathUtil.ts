import { ResType } from "../message/MsgAddRes";

export default class PathUtil {
    public static getMaskBgUrl():string{
        return "ui/maskbg";
    }

    public static getCoinUrl():string{
        return "ui/coin_icon";
    }
    public static getStarUrl():string{
        return "ui/xx";
    }
    public static getRESIcon(type:ResType):string{
        if(type == ResType.Energy){
            return "ui/icon_xin";
        }else if(type == ResType.Water){
            return "ui/water";
        }
        return "ui/icon_xin";
    }
}
