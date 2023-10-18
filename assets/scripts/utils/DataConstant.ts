export default class DataConstant {

    //总共可以玩的次数
    public static GAME_HEALTH_COUNT = 8;
    //当前金币数量
    public static GAME_COIN_COUNT = 0;

    // public static TIMER_TASK_SCHEDULE: number = 5 * 60;
    public static readonly TIMER_TASK_SCHEDULE: number = 1 * 60;

    public static readonly SCENE_START: string = "start";
    public static readonly SCENE_GAME1: string = "game1";
    public static readonly SCENE_GAME2: string = "game2";
    public static readonly SCENE_GAME3: string = "game3";
    public static readonly SCENE_HELP: string = "help";

    public static readonly LOCAL_STORAGE_KEY_AUDIO_VOLUME: string = "audioVolume";
    public static readonly LOCAL_STORAGE_KEY_SOUND_VOLUME: string = "soundVolume";

    public static readonly LOCAL_STORAGE_KEY_GAME_HEALTH: string = "gameHealth";
    public static readonly LOCAL_STORAGE_KEY_GAME_COIN: string = "gameCoin";
    public static readonly LOCAL_STORAGE_KEY_USER_PASS_LEVEL: string = "userPassLevel";
    //道具
    public static readonly LOCAL_STORAGE_KEY_USER_PROPS_1: string = "userProps1";
    public static readonly LOCAL_STORAGE_KEY_USER_PROPS_2: string = "userProps2";
    public static readonly LOCAL_STORAGE_KEY_USER_PROPS_3: string = "userProps3";
    public static readonly LOCAL_STORAGE_KEY_USER_PROPS_4: string = "userProps4";


    //第一次使用
    public static readonly LOCAL_STORAGE_KEY_IS_FIRST_USE: string = "firstUse";

    public static readonly EVENT_TOUCH_LINE_MOVE = "lineMove";
    public static readonly EVENT_TOUCH_BEGIN_CONTACT = "tmBeginContact";
    public static readonly EVENT_BEGIN_CONTACT_FAIL = "bgContactFail";
    public static readonly EVENT_UI_RENDER = "renderUI";
    public static readonly EVENT_TOUCH_LINE_START = "touchLineStart";
    public static readonly EVENT_TOUCH_LINE_END = "touchLineEnd";
    public static readonly EVENT_GAME_PROPS_USE = "useProps";

    public static readonly EVENT_RESET_GAME_NODE = "resetGameNode";
    public static readonly EVENT_AUDIO_VALUE = "audioValue";

    public startTimerTask() {

    }

}