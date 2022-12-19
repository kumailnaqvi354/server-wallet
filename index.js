// const { ethers } = require("ethers")
// const UNISWAP = require("@uniswap/sdk")
// const fs = require('fs');
// const { Token, ETHER, Fetcher, Route, Trade, TokenAmount, TradeType, Percent, ChainId} = require("@uniswap/sdk");
// const { getAddress } = require("ethers/lib/utils");
// const QUICKNODE_HTTP_ENDPOINT = "https://magical-quick-resonance.ethereum-goerli.discover.quiknode.pro/d500a461c56035b27452e630b9230c9e1628e045/"
// let provider = new ethers.providers.getDefaultProvider(QUICKNODE_HTTP_ENDPOINT)
// const privateKey = fs.readFileSync(".secret").toString().trim()
// const wallet = new ethers.Wallet(privateKey, provider)
// UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
// UNISWAP_ROUTER_ABI = fs.readFileSync("./abis/router.json").toString()
// UNISWAP_ROUTER_CONTRACT = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, provider)

// const USDC = new Token(ChainId.GÖRLI,
//     "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
//     6);

// async function swapTokens(token1, token2, amount, slippage = "50") {

//     try {
//         const pair = await Fetcher.fetchPairData(token1, token2, provider); //creating instances of a pair
//         const route = await new Route([pair], token2); // a fully specified path from input token to output token
//         let amountIn = ethers.utils.parseEther(amount.toString()); //helper function to convert ETH to Wei
//         amountIn = amountIn.toString()

//         const slippageTolerance = new Percent(slippage, "10000"); // 50 bips, or 0.50% - Slippage tolerance

//         const trade = new Trade( //information necessary to create a swap transaction.
//                 route,
//                 new TokenAmount(token2, amountIn),
//                 TradeType.EXACT_INPUT
//         );

//         const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
//         const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();
//         const path = [token2.address, token1.address]; //An array of token addresses
//         const to = wallet.address; // should be a checksummed recipient address
//         const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
//         const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex
//         const valueHex = await ethers.BigNumber.from(value.toString()).toHexString(); //convert to hex string

//         //Return a copy of transactionRequest, The default implementation calls checkTransaction and resolves to if it is an ENS name, adds gasPrice, nonce, gasLimit and chainId based on the related operations on Signer.
//         const rawTxn = await UNISWAP_ROUTER_CONTRACT.populateTransaction.swapExactETHForTokens(amountOutMinHex, path, to, deadline, {
//             value: valueHex
//         })

//         //Returns a Promise which resolves to the transaction.
//         let sendTxn = (await wallet).sendTransaction(rawTxn)

//         //Resolves to the TransactionReceipt once the transaction has been included in the chain for x confirms blocks.
//         let reciept = (await sendTxn).wait()

//         //Logs the information about the transaction it has been mined.
//         if (reciept) {
//             console.log(" - Transaction is mined - " + '\n'
//             + "Transaction Hash:", (await sendTxn).hash
//             + '\n' + "Block Number: "
//             + (await reciept).blockNumber + '\n'
//             + "Navigate to https://goerli.etherscan.io/txn/"
//             + (await sendTxn).hash, "to see your transaction")
//         } else {
//             console.log("Error submitting transaction")
//         }

//     } catch(e) {
//         console.log(e)
//     }
// }

// swapTokens(USDC, ETHER, .02) //first argument = token we want, second = token we have, the amount we want

const { WETH } = require("@uniswap/sdk");
const UNISWAP = require("@uniswap/sdk");
console.log(`The chainId of mainnet is ${UNISWAP.ChainId.GÖRLI}.`);

const chainId = UNISWAP.ChainId.GÖRLI;
const tokenAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"; // must be checksummed
const decimals = 6;

const USDC = new UNISWAP.Token(chainId, tokenAddress, decimals);
console.log("debug::", USDC);

async function getPair() {
  const pairAddress = await UNISWAP.Pair.getAddress(
    USDC,
    UNISWAP.WETH[USDC.chainId]
  );

  const reserves = [
    USDC.address,
    UNISWAP.WETH,
    /* use pairAddress to fetch reserves here */
  ];

  console.log("debugg data", reserves);
  const [reserve0, reserve1] = reserves;

  const tokens = [USDC, UNISWAP.WETH[USDC.chainId]];
  const [token0, token1] = tokens[0].sortsBefore(tokens[1])
    ? tokens
    : [tokens[1], tokens[0]];

  const pair = new UNISWAP.Pair(
    new UNISWAP.TokenAmount(token0, reserve0),
    new UNISWAP.TokenAmount(token1, reserve1)
  );
  return pair;
}

console.log("debugg here", getPair());
