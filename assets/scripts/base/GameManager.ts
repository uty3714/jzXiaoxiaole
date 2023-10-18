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

        if (localHealth == undefined || localHealth == null) {
            this.saveNewHealth();
        } else {
            let saveData = JSON.parse(localHealth);
            const isNewDay = util.isNewDay(saveData.day);
            if (isNewDay) {
                this.saveNewHealth();
            } else {
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

        //取道具
        let props1Str = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_1);
        if (props1Str == undefined || props1Str == null || props1Str == "") {
            props1Str = "0";
        }
        this._propsTips = Number(props1Str);

        let props2Str = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_2);
        if (props2Str == undefined || props2Str == null || props2Str == "") {
            props2Str = "0";
        }
        this._propDestroyNode = Number(props2Str);

        let props3Str = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_3);
        if (props3Str == undefined || props3Str == null || props3Str == "") {
            props3Str = "0";
        }
        this._propRandomNode = Number(props3Str);

        let props4Str = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_4);
        if (props4Str == undefined || props4Str == null || props4Str == "") {
            props4Str = "0";
        }
        this._propAddTime = Number(props4Str);

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
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_1, this._propsTips.toString());
    }

    addMorePropDestroyNode(value: number) {
        this._propDestroyNode += value;
        this.render();
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_2, this._propDestroyNode.toString());
    }

    addMorePropRandomNode(value: number) {
        this._propRandomNode += value;
        this.render();
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_3, this._propRandomNode.toString());
    }

    addMorePropAddTime(value: number) {
        this._propAddTime += value;
        this.render();
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_4, this._propAddTime.toString());
    }

    subMorePropTips(value: number) {
        this._propsTips -= value;
        if (this._propsTips < 0) {
            this._propsTips = 0;
        }
        this.render();
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_1, this._propsTips.toString());
    }

    subMorePropDestroyNode(value: number) {
        this._propDestroyNode -= value;
        if (this._propDestroyNode < 0) {
            this._propDestroyNode = 0;
        }
        this.render();
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_2, this._propDestroyNode.toString());
    }

    subMorePropRandomNode(value: number) {
        this._propRandomNode -= value;
        if (this._propRandomNode < 0) {
            this._propRandomNode = 0;
        }
        this.render();
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_3, this._propRandomNode.toString());
    }

    subMorePropAddTime(value: number) {
        this._propAddTime -= value;
        if (this._propAddTime < 0) {
            this._propAddTime = 0;
        }
        this.render();
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_USER_PROPS_4, this._propAddTime.toString());
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


    getCurrentAudioValue(): number {
        let audioValueStr = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_AUDIO_VOLUME);
        if (audioValueStr == undefined || audioValueStr == null || audioValueStr == "") {
            audioValueStr = "1";
        }
        const audioValue = parseFloat(audioValueStr);
        return audioValue;
    }

    render() {
        EventManager.Instence.emit(DataConstant.EVENT_UI_RENDER);
    }


}

