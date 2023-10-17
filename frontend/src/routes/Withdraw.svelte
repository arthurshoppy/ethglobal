<script lang="ts">
	import BackButtton from "../elements/BackButtton.svelte";
	import Button from "../elements/Button.svelte";
</script>

<div class="grid gap-1">
	<BackButtton />

	<div class="bg-white rounded-2xl flex flex-col px-6 py-5">
		<div class="mx-auto text-lg font-bold">Withdraw money</div>
		<div class="mx-auto text-center text-mid/4 mt-1">
			Fill in the details to <br /> withdraw funds from your account.
		</div>

		<div class="mt-3 flex flex-col gap-2 flex-grow">
			{#each [["Beneficiary", "Fname Lname"], ["IBAN", "ES00 0000 0000 0000 0000"], ["BIC", "EAPFESM2XXX"]] as text}
				<div class="border rounded-xl bg-gray-50 px-2 py-1 relative">
					<div class="text-xs text-gray-400 font-normal">{text[0]}</div>
					<input
						class="outline-none bg-gray-500/5 focus:bg-gray-500/10 rounded-md mt-px px-1 py-px"
					/>
					<!-- <div class="-mt-px text-gray-500 text-mid">{text[1]}</div> -->
				</div>
			{/each}
		</div>

		<input
			class="outline-none text-center mx-auto text-3xl w-52 mt-6"
			value="0,00 €"
		/>

		<Button class="mt-4" disabled={true}>Withdraw</Button>
	</div>
</div>
