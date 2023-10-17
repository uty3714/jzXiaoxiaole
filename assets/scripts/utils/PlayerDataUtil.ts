import { sys } from "cc";
import DataConstant from "./DataConstant";
import Singleton from "../base/Singleton";

export default class PlayerDataUtil extends Singleton {
    static get instance() {
        return super.getInstance<PlayerDataUtil>();
    }

    public canGame(): boolean {
        return DataConstant.GAME_HEALTH_COUNT > 0;
    }

    public canShopping(value: number): boolean {
        return DataConstant.GAME_COIN_COUNT - value > 0;
    }

    public updateAddHealth(): number {
        //+1
        const updateValue = DataConstant.GAME_HEALTH_COUNT++;
        DataConstant.GAME_HEALTH_COUNT = updateValue;
        console.log("updateAddHealth", updateValue);
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_GAME_HEALTH, updateValue + "");
        return updateValue;
    }

    public updateSubHealth(): number {
        //-1
        var updateValue = DataConstant.GAME_HEALTH_COUNT--;
        if (updateValue < 0) {
            updateValue = 0;
        }
        console.log("updateSubHealth", updateValue);
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_GAME_HEALTH, updateValue + "");
        return updateValue;
    }

    public updateAddCoins() {

    }

    public updateSubCoins() {

    }



}

