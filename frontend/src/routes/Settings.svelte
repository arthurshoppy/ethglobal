<script lang="ts">
	import { getContext } from "svelte";
	import BackButtton from "../elements/BackButtton.svelte";
	import type { createFauxBackendCtx } from "../contexts/backend";

	const backend =
		getContext<ReturnType<typeof createFauxBackendCtx>>("fauxBackend");
</script>

<div class="grid gap-2">
	<BackButtton />

	<div class="text-3xl/7">Settings</div>

	<div>
		{backend.getPrivateKey()}
	</div>
</div>
