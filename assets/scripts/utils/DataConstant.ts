export default class DataConstant {

    //总共可以玩的次数
    public static GAME_HEALTH_COUNT = 8;
    //当前金币数量
    public static GAME_COIN_COUNT = 0;

    // public static TIMER_TASK_SCHEDULE: number = 5 * 60;
    public static readonly TIMER_TASK_SCHEDULE: number = 2 * 60;

    public static readonly SCENE_START: string = "start";
    public static readonly SCENE_GAME: string = "game";
    public static readonly SCENE_HELP: string = "help";

    public static readonly LOCAL_STORAGE_KEY_AUDIO_VOLUME: string = "audioVolume";
    public static readonly LOCAL_STORAGE_KEY_SOUND_VOLUME: string = "soundVolume";

    public static readonly LOCAL_STORAGE_KEY_GAME_HEALTH: string = "gameHealth";
    public static readonly LOCAL_STORAGE_KEY_GAME_COIN: string = "gameCoin";

    //第一次使用
    public static readonly LOCAL_STORAGE_KEY_IS_FIRST_USE: string = "firstUse";

    public static readonly EVENT_TOUCH_LINE_MOVE = "lineMove";
    public static readonly EVENT_TOUCH_BEGIN_CONTACT = "tmBeginContact";

    public startTimerTask() {

    }

}