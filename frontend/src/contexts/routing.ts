import type { ComponentType } from "svelte";
import { readable, writable } from "svelte/store";
import Home from "../routes/Home.svelte";
import AddFunds from "../routes/AddFunds.svelte";
import Earn from "../routes/Earn.svelte";

export function createRoutingCtx() {
    
    const routes: { [key: string]: ComponentType } = {
        home: Home,
        addfunds: AddFunds,
        earn: Earn
    }

    const ctx = {
        history: ['home'] as string[],

        route: writable<string>('home'),

        routeComponent: readable<ComponentType>(undefined, (set) => {
            const unsub = ctx.route.subscribe(r => {
                set(routes[r])
            }) as () => void;

            return () => unsub();
        }),

        goto(route: string, asRoot = false) {
            ctx.route.set(route)
            if (asRoot) ctx.history = []
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