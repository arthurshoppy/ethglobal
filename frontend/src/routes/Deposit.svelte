<script lang="ts">
	import BackButtton from "../elements/BackButtton.svelte";
</script>

<div class="grid gap-1">
	<BackButtton />

	<div class="bg-white rounded-2xl flex flex-col px-6 py-5">
		<div class="mx-auto text-lg font-bold">Deposit money</div>
		<div class="mx-auto text-center text-mid/4 mt-1">
			Use these details to <br /> transfer funds to your account.
		</div>

		<div class="mt-3 flex flex-col gap-2 flex-grow">
			{#each [["Beneficiary", "Fname Lname"], ["IBAN", "ES00 0000 0000 0000 0000"], ["BIC", "EAPFESM2XXX"]] as text}
				<div class="border rounded-xl bg-gray-50 pl-2 pr-14 py-1 relative">
					<div class="text-xs text-gray-400 font-normal">{text[0]}</div>
					<div class="-mt-px text-gray-500 text-mid">{text[1]}</div>
					<div
						class="bg-gray-200 absolute rounded-r-xl right-0 top-0 w-8 h-full grid"
					>
						<div
							class="h-3.5 w-3 border-2 border-neutral-400 m-auto rounded-sm"
							style="transform: translate(-1px, 9px);"
						/>
						<div
							class="h-3.5 w-3 border-2 border-neutral-400 bg-gray-200 m-auto rounded-sm"
							style="transform: translate(2px, -6px);"
						/>
						<div
							class="cursor-pointer rounded-r-xl hover:bg-black/5 active:bg-black/10 absolute inset-0"
						/>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
