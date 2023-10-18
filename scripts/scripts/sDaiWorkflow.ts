import {ethers, providers} from 'https://esm.sh/ethers@5.7.0'
import {EUReABI} from "./constants.ts"


// Generating the calldata dynamically to execute transactions is needed because
// our arguments will vary and this is how AA does calls(?)

// WxDAI --> sDAI (gnosis mainnet)

//setup provider
const GNOSIS_TENDERLY_RPC = "https://rpc.tenderly.co/fork/5f52445c-892f-498a-8bbd-dc3792b5f206"
const provider = new providers.JsonRpcProvider(GNOSIS_TENDERLY_RPC)

// gnosis addresses
const USER = "0x2Ef58C712a61595c47AeEBA4A70C95f31CaC6904"
const WxDAI = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"
const sDAI = "0xaf204776c7245bF4147c2612BF6e5972Ee483701"

//signer
const wallet = new ethers.Wallet("b30bda37ff2482558e475fe51c64665a5bf32045e4970c7deda1cb2f0b866ce1", provider)
const EUREContract = new ethers.Contract("0xcB444e90D8198415266c6a2724b7900fb12FC56E", EUReABI, wallet)

const allOfBalance = await EUREContract.balanceOf(USER)
console.log('get current balance', allOfBalance);



////transaction here ( to be WxDAI --> sDAI)
const encoder = new ethers.utils.Interface(EUReABI) // get contract
const encodedData = encoder.encodeFunctionData('transfer', [USER, 123]) // encode calling the function

wallet.signTransaction(
    {   to: USER, 
        data: encodedData, //sign the transaction with the encoded
        value: '0x00'
    })

