<script lang="ts">
	export let icon: string = "";

	let className = "";
	export { className as class };
</script>

<div class="bg-white rounded-2xl p-4 flex {className}" on:click>
	<img src={icon} alt="coin icon" class="w-[34px] h-[34px] self-center" />
	<div class="flex flex-col ml-3">
		<slot name="title" />
		<slot name="desc" />
	</div>
	<slot name="right" />
</div>
