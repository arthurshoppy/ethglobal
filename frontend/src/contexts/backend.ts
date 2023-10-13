import { readable } from "svelte/store";

export function createFauxBackendCtx() {

    // let walletAdaptor
    // let instance

    const ctx = {
      
      async createAccount() {
        // walletAdaptor = new ConnectAdaptor({
        //   chainId: SupportedNetworks.MUMBAI,
        //   apiKey,
        // });
        
        // instance = new ComethWallet({
        //   authAdapter: walletAdaptor,
        //   apiKey,
        // });

        // const walletAddress = await instance.getAddress()
        // localStorage.setItem("walletAddress", walletAddress)
      },

      async initializeAccount() {
        // instance = new ComethWallet({
        //   authAdapter: walletAdaptor,
        //   apiKey,
        // });

        // await instance.connect(localStorageAddress);
      },

      async createUser() {
        
        

      },

      async stakeSDAI() {

      }

    }

    // const localStorageAddress = window.localStorage.getItem("walletAddress");
    // if (localStorageAddress) {
    //   ctx.initializeAccount()
    // }

    return ctx
}