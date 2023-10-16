export class MathUtil {

    static randomBanPzNum(len: number): number {
        return Math.floor(Math.random() * len + 1);
    }

}