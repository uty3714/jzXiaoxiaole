import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PbMainTopNode')
export class PbMainTopNode extends Component {

    @property(Label) txt: Label = null;

    updateText(newData: string) {
        this.txt.string = newData;
    }

}

