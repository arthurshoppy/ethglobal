<script lang="ts">
	import { getContext } from "svelte";
	import BackButtton from "../elements/BackButtton.svelte";
	import type { createFauxBackendCtx } from "../contexts/backend";
	import Button from "../elements/Button.svelte";

	const backend =
		getContext<ReturnType<typeof createFauxBackendCtx>>("fauxBackend");

	const address = backend.address;

	const eoa = backend.getEOA();

	let keyRevealed = false;
</script>

<div class="grid gap-4">
	<BackButtton />

	<div class="text-3xl/7">Settings</div>

	<div class="bg-white rounded-lg p-2 grid gap-2">
		<div class="flex flex-col">
			<span class="text-lg">Safe Address</span>
			<div
				class="text-sm bg-neutral-100 hover:bg-neutral-200 rounded px-1 py-px"
			>
				{$address}
			</div>
		</div>

		<div class="flex flex-col">
			<span class="text-lg">Address</span>
			<div
				class="text-sm bg-neutral-100 hover:bg-neutral-200 rounded px-1 py-px"
			>
				{eoa.address}
			</div>
		</div>

		<div class="flex flex-col">
			<span class="text-lg">Private Key</span>
			<div class="text-sm flex gap-2">
				<div
					class="break-words max-w-[268px] bg-neutral-100 hover:bg-neutral-200 rounded px-1 py-px"
				>
					{keyRevealed
						? eoa.privateKey
						: Array(76)
								.fill(1)
								.map(() => "*")
								.reduce((p, c) => p + c, "")}
				</div>
				<Button
					class="!rounded !my-0 text-white grow !px-1"
					disabled={keyRevealed}
					on:click={() => (keyRevealed = true)}
				>
					Reveal Key
				</Button>
			</div>
		</div>
	</div>
</div>
