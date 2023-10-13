import { tick, type ComponentType } from "svelte";
import { readable, writable } from "svelte/store";

import Home from "../routes/Home.svelte";
import AddFunds from "../routes/AddFunds.svelte";
import Earn from "../routes/Earn.svelte";
import Transactions from "../routes/Transactions.svelte";
import Settings from "../routes/Settings.svelte";

function runAnimation(steps: Keyframe[], options: KeyframeAnimationOptions = { duration: 50 }) {
    return new Promise(r => document.getElementById('outlet')!.animate(steps, options).onfinish = r)
}

export function createRoutingCtx() {
    
    const routes: { [key: string]: ComponentType } = {
        home: Home,
        addfunds: AddFunds,
        earn: Earn,

        transactions: Transactions,
        settings: Settings
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

        get cangoback() {
            return ctx.history.length > 1
        },

        async goto(route: string, asRoot = false) {
            await runAnimation([
                { transform: "translate(0px, 0)", opacity: "1" },
                { transform: "translate(-10px, 0)", opacity: "0.2" }
            ], { easing: "ease-in", duration: 75 })

            ctx.route.set(route)
            if (asRoot) ctx.history = []
            ctx.history.push(route)

            await tick()

            runAnimation([
                { transform: "translate(10px, 0)", opacity: "0.2" },
                { transform: "translate(0px, 0)", opacity: "1" }
            ], { easing: "ease-out", duration: 75 })
        },

        async goback() {
            if (ctx.history.length < 2) return
            
            await runAnimation([
                { transform: "translate(0px, 0)", opacity: "1" },
                { transform: "translate(20px, 0)", opacity: "0.5" }
            ])

            ctx.history.pop()
            ctx.route.set(ctx.history[ctx.history.length - 1])

            await tick()

            await runAnimation([
                { transform: "translate(-20px, 0)", opacity: "0.5" },
                { transform: "translate(0px, 0)", opacity: "1" }
            ])
        },
    }

    return ctx
}