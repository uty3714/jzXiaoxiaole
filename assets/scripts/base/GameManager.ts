import { sys } from "cc";
import Singleton from './Singleton';
import EventManager from "../utils/EventManager";
import DataConstant from "../utils/DataConstant";
import { util } from "../utils/util";

export default class GameManager extends Singleton {

    static get Instence() {
        return super.getInstance<GameManager>();
    }


    private _energyTime: number = -1;
    //用户的金币
    private _userCoins: number = 0;
    //用户的体力
    private _userHealth: number = 8;
    //用户当前的关卡
    private _userCurrentLevel: number = 1;

    private _isTimerStart: boolean = false;

    private _propsTips: number = 0;
    private _propDestroyNode: number = 0;
    private _propRandomNode: number = 5;
    private _propAddTime: number = 5;

    init() {
        const localHealth = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_GAME_HEALTH);
        console.log("localHealth = " + localHealth);

        if (localHealth == undefined || localHealth == null) {
            this.saveNewHealth();
        } else {
            let saveData = JSON.parse(localHealth);
            const isNewDay = util.isNewDay(saveData.day);
            console.log("isNewDay:", "today", isNewDay);
            if (isNewDay) {
                console.log("是新的一天");
                this.saveNewHealth();
            } else {
                console.log("不是新的一天，用老的数据");
                this._userHealth = saveData.health;
            }
        }

        //取金币
        const localCoins = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_GAME_COIN);
        if (localCoins == undefined || localCoins == null) {
            this._userCoins = DataConstant.GAME_COIN_COUNT;
            sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_GAME_COIN, this._userCoins.toString());
        } else {
            this._userCoins = Number(localCoins);
        }
    }

    private saveNewHealth() {
        const saveData = util.createHealthJson(DataConstant.GAME_HEALTH_COUNT);
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_GAME_HEALTH, saveData);
        this._userHealth = DataConstant.GAME_HEALTH_COUNT;
    }

    get propTipsNumber() {
        return this._propsTips;
    }

    set addPropTips(newData) {
        this._propsTips = newData;
        this.render();
    }

    get propDestroyNodeNumber() {
        return this._propDestroyNode;
    }

    set addPropDestroyNode(newData) {
        this._propDestroyNode = newData;
        this.render();
    }

    get propRandomNodeNumber() {
        return this._propRandomNode;
    }

    set addPropRandomNode(newData) {
        this._propRandomNode = newData;
        this.render();
    }

    get propAddTimeNumber() {
        return this._propAddTime;
    }

    set addPropAddTime(newData) {
        this._propAddTime = newData;
        this.render();
    }

    get isTimerStart() {
        return this._isTimerStart;
    }

    set isTimerStart(newData) {
        this._isTimerStart = newData;
    }

    set userEnergyTime(newData) {
        this._energyTime = newData;
    }

    get energyTime() {
        return this._energyTime;
    }

    get userCoins() {
        return this._userCoins;
    }

    set userCoins(newData) {
        this._userCoins = newData;
        this.render();
    }

    get userHealth() {
        return this._userHealth;
    }

    set userHealth(newData) {
        this._userHealth = newData;
        this.render();
    }

    get userCurrentLevel() {
        return this._userCurrentLevel;
    }

    set userCurrentLevel(newData) {
        this._userCurrentLevel = newData;
        this.render();
    }

    addMorePropTips(value: number) {
        this._propsTips += value;
        this.render();
    }

    addMorePropDestroyNode(value: number) {
        this._propDestroyNode += value;
        this.render();
    }

    addMorePropRandomNode(value: number) {
        this._propRandomNode += value;
        this.render();
    }

    addMorePropAddTime(value: number) {
        this._propAddTime += value;
        this.render();
    }

    subMorePropTips(value: number) {
        this._propsTips -= value;
        if (this._propsTips < 0) {
            this._propsTips = 0;
        }
        this.render();
    }

    subMorePropDestroyNode(value: number) {
        this._propDestroyNode -= value;
        if (this._propDestroyNode < 0) {
            this._propDestroyNode = 0;
        }
        this.render();
    }

    subMorePropRandomNode(value: number) {
        this._propRandomNode -= value;
        if (this._propRandomNode < 0) {
            this._propRandomNode = 0;
        }
        this.render();
    }

    subMorePropAddTime(value: number) {
        this._propAddTime -= value;
        if (this._propAddTime < 0) {
            this._propAddTime = 0;
        }
        this.render();
    }



    canGame(): boolean {
        return this._userHealth > 0;
    }

    addUserHealth(): number {
        this._userHealth++;
        this.render();
        const saveData = util.createHealthJson(this._userHealth);
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_GAME_HEALTH, saveData);
        return this._userHealth;
    }

    addMoreUserHealth(value: number): number {
        this._userHealth += value;
        if (this._userHealth >= DataConstant.GAME_HEALTH_COUNT) {
            this._isTimerStart = false;
        }
        this.render();
        const saveData = util.createHealthJson(this._userHealth);
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_GAME_HEALTH, saveData);
        return this._userHealth;
    }

    addUserCoins(value: number) {
        this._userCoins += value;
        this.render();
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_GAME_COIN, this._userCoins.toString());
    }

    subUserHealth() {
        this._userHealth--;
        if (this._userHealth < 0) {
            this._userHealth = 0;
        }
        const saveData = util.createHealthJson(this._userHealth);
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_GAME_HEALTH, saveData);
        this.render();
    }

    subUserCoins() {
        this._userCoins--;
        if (this._userCoins < 0) {
            this._userCoins = 0;
        }
        this.render();
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_GAME_COIN, this._userCoins.toString());
    }

    render() {
        console.log("game manager render-->");

        EventManager.Instence.emit(DataConstant.EVENT_UI_RENDER);
    }


}

