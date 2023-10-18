import { _decorator, Animation, AnimationClip, Button, Component, director, Label, Node, ProgressBar, Slider, Sprite, sys } from 'cc';
import DataConstant from '../../utils/DataConstant';
import EventManager from '../../utils/EventManager';
const { ccclass, property } = _decorator;

@ccclass('SettingsManager')
export class SettingsManager extends Component {

    @property(Sprite) closeBtn: Sprite = null;
    @property(Sprite) audioSprite: Sprite = null;
    @property(Slider) audioSlider: Slider = null;
    @property(ProgressBar) audioProgressBar: ProgressBar = null;
    @property(Sprite) soundSprite: Sprite = null;
    @property(Slider) soundSlider: Slider = null;
    @property(ProgressBar) SoundProgressBar: ProgressBar = null;
    @property(Button) helpButton: Button = null;
    @property(Label) privacyPolicyLabel: Label = null;

    private _scaleAnimation: Animation = null;

    private _audioValue: number = 0.0;
    private _soundValue: number = 0.0;

    protected onLoad(): void {
        this._scaleAnimation = this.node.getComponent(Animation);
        console.log("settings onLoad " + this._scaleAnimation + ", node = " + this.node);

        const initAudioValue = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_AUDIO_VOLUME);
        const initSoundValue = sys.localStorage.getItem(DataConstant.LOCAL_STORAGE_KEY_SOUND_VOLUME);
        console.log("audio: " + initAudioValue + ", sound = " + initSoundValue);

        if (null == initAudioValue) {
            this._audioValue = 1;
        } else {
            this._audioValue = parseFloat(initAudioValue);
        }
        if (null == initSoundValue) {
            this._soundValue = 1;
        } else {
            this._soundValue = parseFloat(initSoundValue);
        }

        this.audioSlider.progress = this._audioValue;
        this.audioProgressBar.progress = this._audioValue;
        this.soundSlider.progress = this._soundValue;
        this.SoundProgressBar.progress = this._soundValue;

        this.audioSlider.node.on("slide", this.onAudioSliderChange, this);
        this.soundSlider.node.on("slide", this.onSoundSliderChange, this);

    }

    protected onEnable() {
        console.log("settings onEnable " + this._scaleAnimation);
        this._scaleAnimation.play("scaleAnimClip");
    }

    closeClick() {
        this.node.active = false;
    }

    helpClick() {
        director.loadScene(DataConstant.SCENE_HELP);
    }

    privacyPolicyClick() {

    }


    private onAudioSliderChange(slider: Slider) {
        this._audioValue = slider.progress;
        this.audioProgressBar.progress = this._audioValue;
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_AUDIO_VOLUME, slider.progress.toString());
        console.log("设置音乐:" + this._audioValue);
        EventManager.Instence.emit(DataConstant.EVENT_AUDIO_VALUE, this._audioValue);
    }

    private onSoundSliderChange(slide: Slider) {
        this._soundValue = slide.progress;
        this.SoundProgressBar.progress = this._soundValue;
        sys.localStorage.setItem(DataConstant.LOCAL_STORAGE_KEY_SOUND_VOLUME, slide.progress.toString());


    }
}

