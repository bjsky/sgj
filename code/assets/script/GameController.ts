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
    

    public startGame(root:cc.Node){
        UI.registerLayer(root);
        Global.initSystemInfo();

        Loading.startLoading(this.onLoadingComplete.bind(this));

    }
    
    private _loadingComplete:boolean = false;
    public get loadingComplete(){
        return this._loadingComplete;
    }
    private onLoadingComplete(){
        this._loadingComplete = true;
        EVENT.emit(GameEvent.Loading_complete);
    }

}


export var Game:GameController = GameController.getInstance();