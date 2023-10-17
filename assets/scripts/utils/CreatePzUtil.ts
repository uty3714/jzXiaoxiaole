import { Node, Prefab, instantiate, resources } from 'cc'
import { MathUtil } from './MathUtil';
import Singleton from '../base/Singleton';
import { PzEnumType } from './PzEnumType';

export default class CreatePzUtil extends Singleton {

    private static readonly bandPzAddParentNode: string = "ParentNode";
    private readonly pzArray = [101, 102, 103, 104, 105, 106, 201, 202, 203, 204, 205, 206, 301, 302, 303, 304];
    private createPzTotal: number = 0;

    static get Instence() {
        return super.getInstance<CreatePzUtil>();
    }

    set resetCreatePzTotal(value: number) {
        this.createPzTotal = value;
    }

    get createPzTotalCount() {
        return this.createPzTotal;
    }

    //region 随机数据
    /**
    * 创建中间板子上的瓶子数据
    */
    public createRandomPzData(banNode: Node, pzArray?: number[]) {

        const banCreateMaxPzNum = MathUtil.randomBanPzNum(3);
        console.log("当前的板子", banNode.name, "应该生成", banCreateMaxPzNum, "个瓶子");
        const bandAddPzParentNode = banNode.getChildByName(CreatePzUtil.bandPzAddParentNode);
        if (3 == banCreateMaxPzNum) {
            //生成3个预制体
            this.createBanMiddlePz(bandAddPzParentNode, pzArray);
            this.createBanLeftPz(bandAddPzParentNode, pzArray);
            this.createBanRightPz(bandAddPzParentNode, pzArray);
        } else if (2 == banCreateMaxPzNum) {
            //生成2个预制体
            this.createBan2PzData(bandAddPzParentNode, pzArray);
        } else {
            //生成1个预制体
            this.createBan1PzData(bandAddPzParentNode, pzArray);
        }
    }
    /**
     * 随机1个位置添加瓶子
     * @param addPzNode addNode
     */
    private createBan1PzData(addPzNode: Node, pzArray?: number[]) {
        const createIndex = MathUtil.randomBanPzNum(3);
        if (1 == createIndex) {
            //创建中间的瓶子
            this.createBanMiddlePz(addPzNode, pzArray);
        } else if (2 == createIndex) {
            this.createBanLeftPz(addPzNode, pzArray);
        } else {
            this.createBanRightPz(addPzNode, pzArray);
        }
    }
    /**
     * 随机2个位置添加瓶子
     * @param addPzNode addNode
     */
    private createBan2PzData(addPzNode: Node, pzArray?: number[],) {
        const vacancyIndex = MathUtil.randomBanPzNum(3);
        if (1 == vacancyIndex) {
            //创建左 右
            this.createBanLeftPz(addPzNode, pzArray);
            this.createBanRightPz(addPzNode, pzArray);
        } else if (2 == vacancyIndex) {
            //创建中间, 右
            this.createBanMiddlePz(addPzNode, pzArray);
            this.createBanRightPz(addPzNode, pzArray);
        } else {
            //创建中间, 左
            this.createBanMiddlePz(addPzNode, pzArray);
            this.createBanLeftPz(addPzNode, pzArray);
        }
    }

    /**
     * 创建板子中间上的瓶子
     */
    private createBanMiddlePz(addPzNode: Node, pzArray?: number[], pzType?: number) {
        //实例化一个
        const middleNode = addPzNode.getChildByName("Middle");
        this.reallyCreatePzPrefab(middleNode, pzArray, pzType);
    }

    /**
     * 创建板子左边上的瓶子
     */
    private createBanLeftPz(addPzNode: Node, pzArray?: number[], pzType?: number) {
        //实例化一个
        const leftNode = addPzNode.getChildByName("Left");
        this.reallyCreatePzPrefab(leftNode, pzArray, pzType);
    }

    /**
    * 创建板子右边上的瓶子
    */
    private createBanRightPz(addPzNode: Node, pzArray?: number[], pzType?: number) {
        //实例化一个
        const rightNode = addPzNode.getChildByName("Right");
        this.reallyCreatePzPrefab(rightNode, pzArray, pzType);
    }
    //endregion


    private reallyCreatePzPrefab(prefabParentNode: Node, pzArray?: number[], pzType?: number) {
        if (pzArray == null) {
            pzArray = this.pzArray;
        }
        console.log("生成瓶子: ", pzArray);

        if (pzType == null) {
            const randomIndex = Math.floor(Math.random() * pzArray.length);
            pzType = pzArray[randomIndex];
        }
        const pzPrefabName = "prefabs/game/pb" + PzEnumType[pzType];
        resources.load(pzPrefabName, Prefab, (error, preafab) => {
            if (error) {
                return;
            }
            this.createPzTotal += 1;
            const pzNode = instantiate(preafab);
            prefabParentNode.addChild(pzNode);
        });
    }

}