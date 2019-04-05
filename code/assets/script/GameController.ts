import { Loading } from "./LoadingController";
import { Global } from "./GlobalData";
import { UI } from "./core/UIManager";
import { EVENT } from "./core/EventController";
import GameEvent from "./GameEvent";

export default class GameController {
    private static _instance: GameController = null;
    public static getInstance(): GameController {
        if (GameController._instance == null) {
            GameController._instance = new GameController();
            
        }
        return GameController._instance;
    }
    

    public startGame(){

        Global.initSystemInfo();

        Loading.startLoading(this.onLoadingComplete);

    }
    
    private onLoadingComplete(){
        EVENT.emit(GameEvent.Loading_complete);
    }

}


export var Game:GameController = GameController.getInstance();