<script lang="ts">
	import BackButtton from "../elements/BackButtton.svelte";
</script>

<div class="grid gap-1">
	<BackButtton />

	<div class="flex items-center justify-between mb-5">
		<div>
			<div class="m1-0 text-lg font-medium" style="font-size: 35px;">-10€</div>
			<div class="m1-0 text-lg font-medium" style="font-size: 19px;">
				Buy 10,41 $
			</div>
		</div>
		<img src="src/assets/usdcoin.png" alt="usdcoin" class="h-12 w-22" />
		<!-- Adjust w-12 to your desired width -->
	</div>

	<!-- Outermost container with white background, rounded corners, column layout, and padding -->
	<div class="bg-white rounded-2xl flex flex-col px-6 py-5">
		<!-- Centered title with large bold font -->
		<!-- Centered text with a medium font size and a top margin. The text is split into two lines using a line break -->
		<div class="m1-0 text-lg font-medium">
			<div class="bg-white rounded p-4 w-full max-w-md">
				<!-- Each row represents a line -->

				<div class="flex flex-col gap-4 text-sm">
					<!-- Amount line -->
					<div class="flex justify-between items-center">
						<div class="text-gray-400">Amount</div>
						<div>10 €</div>
					</div>

					<!-- Price line -->
					<div class="flex justify-between items-center">
						<div class="text-gray-400">Price</div>
						<div><i class="info-icon" /> 10 € = 10,41 $</div>
					</div>

					<!-- Exchanged line -->
					<div class="flex justify-between items-center">
						<div class="text-gray-400">Exchanged</div>
						<div>10,41 $</div>
					</div>

					<!-- Fees line -->
					<div class="flex justify-between items-center">
						<div class="text-gray-400">Fees</div>
						<div><i class="info-icon" /> 0,00 $</div>
					</div>

					<!-- Estimated total proceeds line -->
					<div class="flex justify-between items-center">
						<div class="text-gray-400">Estimated total proceeds</div>
						<div>10,41 $</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
