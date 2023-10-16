
import { _decorator, Component, Node } from 'cc';
import Singleton from '../base/Singleton';
const { ccclass, property } = _decorator;

interface IItem {
    func: Function
    ctx?: unknown
}

export default class EventManager extends Singleton {

    static get Instence() {
        return super.getInstance<EventManager>()
    }

    private eventMap: Map<string, Array<IItem>> = new Map()

    on(eventName: string, func: Function, ctx?: unknown) {
        if (this.eventMap.has(eventName)) {
            this.eventMap.get(eventName).push({ func, ctx })
        } else {
            this.eventMap.set(eventName, [{ func, ctx }])
        }
    }

    off(eventName: string, func: Function, ctx?: unknown) {
        if (this.eventMap.has(eventName)) {
            const index = this.eventMap.get(eventName).findIndex((item) => {
                return item.func === func && item.ctx === ctx
            })
            if (index >= 0) {
                this.eventMap.get(eventName).splice(index, 1)
            }
        }
    }

    emit(eventName: string, ...params: unknown[]) {
        if (this.eventMap.get(eventName)) {
            this.eventMap.get(eventName).forEach(({ func, ctx }) => {
                ctx ? func.apply(ctx, params) : func(params)
            })
        }
    }
}


