<script lang="ts">
	export let disabled = false;

	export let smol = false;

	let className = "";
	export { className as class };
</script>

<button
	on:click
	on:mouseenter
	on:mouseleave
	on:mousedown
	on:mouseup
	class="my-auto rounded-full transition-colors text-white font-normal px-5 {smol
		? 'py-1'
		: 'py-2'} select-none
  {disabled
		? 'bg-neutral-300 pointer-events-none'
		: 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700'} {className}"
>
	<slot />
</button>
