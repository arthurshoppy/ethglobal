import { tick, type ComponentType } from "svelte";
import { readable, writable } from "svelte/store";

import Dashboard from "../routes/Dashboard.svelte";
import Deposit from "../routes/Deposit.svelte";
import Withdraw from "../routes/Withdraw.svelte";
import Transactions from "../routes/Transactions.svelte";
import Settings from "../routes/Settings.svelte";
import SignIn from "../routes/SignIn.svelte";
import DepositDAI from "../routes/DepositDAI.svelte";
import WithdrawDAI from "../routes/WithdrawDAI.svelte";
import DepositUsdc from "../routes/DepositUSDC.svelte";
import WithdrawUsdc from "../routes/WithdrawUSDC.svelte";

function runAnimation(steps: Keyframe[], options: KeyframeAnimationOptions = { duration: 50 }) {
    return new Promise(r => document.getElementById('outlet')!.animate(steps, options).onfinish = r)
}

export function createRoutingCtx() {
    
    const routes: { [key: string]: ComponentType } = {
				signin: SignIn,

        dashboard: Dashboard,
        deposit: Deposit,
				withdraw: Withdraw,
        
				depositdai: DepositDAI,
				withdrawdai: WithdrawDAI,

				depositusdc: DepositUsdc,
				withdrawusdc: WithdrawUsdc,

        transactions: Transactions,
        settings: Settings
    }

    const ctx = {
        history: [] as string[],

        route: writable<string>('signin'),

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
                { transform: `translate(-${asRoot ? 0 : 10}px, 0)`, opacity: "0.1" }
            ], { easing: "ease-in", duration: 75 })

            ctx.route.set(route)
            if (asRoot) ctx.history = []
            ctx.history.push(route)

            await tick()

            runAnimation([
                { transform: `translate(${asRoot ? 0 : 10}px, 0)`, opacity: "0.1" },
                { transform: "translate(0px, 0)", opacity: "1" }
            ], { easing: "ease-out", duration: 75 })
        },

        async goback() {
            if (ctx.history.length < 2) return
            
            await runAnimation([
                { transform: "translate(0px, 0)", opacity: "1" },
                { transform: "translate(20px, 0)", opacity: "0.1" }
            ])

            ctx.history.pop()
            ctx.route.set(ctx.history[ctx.history.length - 1])

            await tick()

            await runAnimation([
                { transform: "translate(-20px, 0)", opacity: "0.1" },
                { transform: "translate(0px, 0)", opacity: "1" }
            ])
        },
    }

    return ctx
}