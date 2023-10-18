import { _decorator, AudioSource, director, Game, instantiate, Label, Node, Prefab, sys } from 'cc';
import DataConstant from '../../utils/DataConstant';
import { RenderManager } from '../../base/RenderManager';
import GameManager from '../../base/GameManager';
import { PbMainTopNode } from '../PbMainTopNode';
import EventManager from '../../utils/EventManager';
const { ccclass, property } = _decorator;

@ccclass('StartGame')
export class StartGame extends RenderManager {

    @property(Prefab) settingsPrefab: Prefab = null!;
    @property(Node) topCoinsNode: Node = null!;
    @property(Node) topHealthNode: Node = null!;

    @property(AudioSource) audioSource: AudioSource = null!;

    private _topCoinsScript: PbMainTopNode = null;
    private _topHealthScript: PbMainTopNode = null;

    private _addHealthCallback: Function = null;
    private _audioValueChangeCallback: Function = null;
    protected onLoad(): void {
        super.onLoad();
        console.log("start game onLoad");
        GameManager.Instence.init();
        this.audioSource = this.node.getComponent(AudioSource);
        this.audioSource.volume = GameManager.Instence.getCurrentAudioValue();
        this._topCoinsScript = this.topCoinsNode.getComponent(PbMainTopNode);
        this._topHealthScript = this.topHealthNode.getComponent(PbMainTopNode);
        console.log("_topCoinsScript ", this._topCoinsScript, ",_topHealthScript ", this._topHealthScript);

        this.updateUserCoinsHealth();

        const userHealth = GameManager.Instence.userHealth;
        if (userHealth < DataConstant.GAME_HEALTH_COUNT) {
            this.updateUserEnergyTime();
        }
        this.registerAudioValueChangeCallback();
    }

    private registerAudioValueChangeCallback() {
        this._audioValueChangeCallback = (value) => {
            console.log("收到了audio 变动");
            this.audioSource.volume = value;
        }
        EventManager.Instence.on(DataConstant.EVENT_AUDIO_VALUE, this._audioValueChangeCallback, this);
    }

    private updateUserEnergyTime() {
        console.log("GameManager.Instence.userEnergyTime ", GameManager.Instence.energyTime);
        if (GameManager.Instence.energyTime > 0) {
            const time = Date.now() - GameManager.Instence.energyTime;
            console.log("差值: " + time);
            const times = Math.floor((time / 1000) / DataConstant.TIMER_TASK_SCHEDULE);
            console.log("次数: " + Math.floor(times));
            const currentHealth = GameManager.Instence.addMoreUserHealth(times);
            if (currentHealth < DataConstant.GAME_HEALTH_COUNT) {
                this.startTimerTask();
            }
        } else {
            if (GameManager.Instence.isTimerStart) {
                return;
            }
            console.log("开始恢复体力计时器...", Date.now());
            this.startTimerTask();
        }
    }

    private startTimerTask() {
        GameManager.Instence.userEnergyTime = Date.now();
        GameManager.Instence.isTimerStart = true;
        this._addHealthCallback = function () {
            const currentHealth = GameManager.Instence.addUserHealth();
            if (currentHealth >= DataConstant.GAME_HEALTH_COUNT) {
                //停止...
                console.log("停止恢复体力");
                this.unschedule(this._addHealthCallback);
            }
        }
        this.schedule(this._addHealthCallback, DataConstant.TIMER_TASK_SCHEDULE);
    }


    private updateUserCoinsHealth() {
        if (this._topCoinsScript == null) {
            this._topCoinsScript = this.topCoinsNode.getComponent(PbMainTopNode);
        }
        if (this._topHealthScript == null) {
            this._topHealthScript = this.topHealthNode.getComponent(PbMainTopNode);
        }

        const userCoins = GameManager.Instence.userCoins;
        this._topCoinsScript.updateText(userCoins + "");

        const userHealth = GameManager.Instence.userHealth;
        this._topHealthScript.updateText(userHealth + "");


    }

    settingsClick() {
        const settingsNode = instantiate(this.settingsPrefab);
        this.node.addChild(settingsNode);
        settingsNode.active = true;

    }

    startGameClick() {
        if (GameManager.Instence.canGame()) {
            GameManager.Instence.subUserHealth();
            if (GameManager.Instence.userHealth < DataConstant.GAME_HEALTH_COUNT) {
                this.startTimerTask();
            }
            //
            let passLevel = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_USER_PASS_LEVEL);
            if (passLevel == undefined || passLevel == null || passLevel == "") {
                passLevel = "1";
            }
            let directorLevel = Number(passLevel) + 1;
            if (directorLevel > 3) {
                directorLevel = 3;
            }
            switch (directorLevel) {
                case 1:
                    director.loadScene(DataConstant.SCENE_GAME1);
                    break;
                case 2:
                    director.loadScene(DataConstant.SCENE_GAME2);
                    break;
                case 3:
                    director.loadScene(DataConstant.SCENE_GAME3);
                    break;
                default:
                    director.loadScene(DataConstant.SCENE_GAME1);
            }
        } else {
            console.log("体力不足");

        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        GameManager.Instence.isTimerStart = false;
        EventManager.Instence.off(DataConstant.EVENT_AUDIO_VALUE, this._audioValueChangeCallback, this);
    }

    render(): void {
        this.updateUserCoinsHealth();
    }

}

