import type { ComponentType } from "svelte";
import { readable, writable } from "svelte/store";
import Home from "../routes/Home.svelte";
import AddFunds from "../routes/AddFunds.svelte";

export function createRoutingCtx() {
    
    const routes: { [key: string]: ComponentType } = {
        home: Home,
        addfunds: AddFunds
    }

    const ctx = {
        history: [] as string[],

        route: writable<string>('addfunds'),

        routeComponent: readable<ComponentType>(undefined, (set) => {
            const unsub = ctx.route.subscribe(r => {
                set(routes[r])
            }) as () => void;

            return () => unsub();
        }),

        goto(route: string) {
            ctx.route.set(route)
            ctx.history.push(route)
        },

        goback() {
            ctx.history.pop()
            if (ctx.cangoback) {
                ctx.route.set(ctx.history[ctx.history.length - 1])
            }
        },

        get cangoback() {
            return ctx.history.length > 0
        }
    }

    return ctx
}