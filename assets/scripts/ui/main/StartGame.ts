import { _decorator, AnimationClip, AnimationComponent, Component, director, instantiate, Label, Node, Prefab, sys, tween, Vec3 } from 'cc';
import DataConstant from '../../utils/DataConstant';
import PlayerDataUtil from '../../utils/PlayerDataUtil';
const { ccclass, property } = _decorator;

@ccclass('StartGame')
export class StartGame extends Component {

    @property(Prefab) settingsPrefab: Prefab = null!;
    @property(Label) topIconLabel: Label = null!;
    @property(Label) topHealthLabel: Label = null!;

    protected onLoad(): void {

        //判断是否是第一次使用
        const isFirstUse = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_IS_FIRST_USE);
        if (null == isFirstUse) {
            sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_IS_FIRST_USE, 'true');
            // 第一次使用
            sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_GAME_COIN, DataConstant.GAME_COIN_COUNT + "");
            sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_GAME_HEALTH, DataConstant.GAME_HEALTH_COUNT + "");
        } else {
            //不是第一次使用,更新本地
            const iconCount = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_GAME_COIN);
            DataConstant.GAME_COIN_COUNT = Number.parseInt(iconCount);
            const healthCount = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_GAME_HEALTH);
            DataConstant.GAME_HEALTH_COUNT = Number.parseInt(healthCount);
        }
        this.topIconLabel.string = DataConstant.GAME_COIN_COUNT + "";
        this.topHealthLabel.string = DataConstant.GAME_HEALTH_COUNT + "";

        // this.schedule(() => {
        //     PlayerDataUtil.instance.updateAddHealth();
        // }, DataConstant.TIMER_TASK_SCHEDULE);

    }

    settingsClick() {
        const settingsNode = instantiate(this.settingsPrefab);
        this.node.addChild(settingsNode);
        settingsNode.active = true;


    }

    startGameClick() {
        director.loadScene(DataConstant.SCENE_GAME1);
    }

}

