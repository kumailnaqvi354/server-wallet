const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const ethers = require('ethers');
const { parseEther } = require('ethers/lib/utils');
const fs = require('fs');

const chainId = ChainId.GÖRLI;
const tokenAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F';
const PRIVATE_KEY = fs.readFileSync(".secret").toString().trim()

const init = async () => {
  const usdc = await Fetcher.fetchTokenData(chainId, tokenAddress);
  const weth = WETH[chainId];
  const pair = await Fetcher.fetchPairData(usdc, weth);
  console.log("debugg::", pair);
  const route = new Route([pair], weth);
  const trade = new Trade(route, new TokenAmount(weth, parseEther("0.0001")), TradeType.EXACT_INPUT);
  console.log("debugg ::2");
  const slippageTolerance = new Percent('50', '10000');
  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
console.log("debugg amountOutMin::",amountOutMin.toString());
  const path = [weth.address, usdc.address];
  const to = '0xed497D04112cD85a6f032A2ADdbCEDEeC8979Daa';
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const value = trade.inputAmount.raw.toString();
  console.log("debugg ::3",value);

  const provider = ethers.getDefaultProvider('goerli', {
    infura: 'https://goerli.infura.io/v3/9499aa74073a4c9d88879199cfb9c926' 
  });

  const signer = new ethers.Wallet(PRIVATE_KEY);
  const account = signer.connect(provider);
  console.log("debugg ::4");

  const uniswap = new ethers.Contract(
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'],
    account
  );
  console.log("debugg ::5");
 
  const tx = await uniswap.swapExactETHForTokens(
    amountOutMin.toString(),
    path,
    to,
    deadline,
    { value, gasPrice: 20e9 }
  );
  console.log(`Transaction hash: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}

init();