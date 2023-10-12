<script lang="ts">
  import euro from "../assets/euro.png";
  import loupe from "../assets/loupe.png";

  import BackButtton from "../elements/BackButtton.svelte";

  const txs = [
    { text: "Deposited from IBAN", value: 3422 },
    { text: "Withdrawn to IBAN", value: -1042 },
  ];
</script>

<div class="grid gap-2">
  <BackButtton />

  <div class="text-3xl/7">Transactions</div>

  <div class="mt-2 flex bg-gray-150 rounded-full px-2 py-1">
    <img class="w-3 h-3 self-center ml-0.5 mr-1.5 select-none" draggable="false" alt="loupe" src={loupe} />
    <input class="w-full bg-transparent font-normal text-mid outline-none" placeholder="Search" />
  </div>

  <div class="mt-6 flex flex-col gap-2">
    <div>Today</div>
    {#each txs as tx}
      <div class="bg-white rounded-2xl flex px-4 py-3 hover:bg-neutral-50">
        <img class="h-8 w-8 self-center mr-1.5" src={euro} alt="euro symbol" draggable="false" />
        <div class="mr-12">
          <div>{tx.text}</div>
          <div class="text-neutral-350 text-xs font-normal">{new Date().toLocaleString()}</div>
        </div>
        <div class="ml-auto">{(tx.value > 0 ? "+" : "") + (tx.value / 100).toFixed(2).replace(".", ",")}</div>
      </div>
    {/each}
  </div>
</div>
