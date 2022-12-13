const Web3 = require("web3");
const { Transaction } = require("ethereumjs-tx");
require("dotenv").config();

const ADDRESS = "0x335F36b473afBB6dD243434507C1598E51fac8AE"; // test usdc token
const ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  
];
const web3 = new Web3(
  "https://eth-goerli.g.alchemy.com/v2/H6SSG7Uyv2OkUbGl5hyJW5bGwAIW7Ztu"
);
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
console.log("account=>", account.address);
// console.log("debugg",web3.eth.getBalance(account.address));

// web3.eth
//   .getBalance(account.address)
//   .then((result) => {
//     console.log("result", result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

async function Withdraw(publicAddress, PrivateKey, walletAddress, amount) {
  // we are getting the last transaction number for nonce
  const senderTransactionCount = await web3.eth.getTransactionCount(
    account.address
  );
  console.log("debugg count", senderTransactionCount);
  // get contract reference
  const contract = new web3.eth.Contract(ABI, ADDRESS);
  console.log(
    "debug test usdc balance 1:",
    await contract.methods.balanceOf(walletAddress).call()
  );

  // everything needs to be in hex
  const txObject = {
    from: account.address,
    value: web3.utils.toHex(0),
    nonce: web3.utils.toHex(senderTransactionCount),
    gasLimit: web3.utils.toHex("280000"),
    gasPrice: web3.utils.toHex(web3.utils.toWei("25", "gwei")),
    data: contract.methods
      .transfer(walletAddress, amount * 1000000)
      .encodeABI(), // ABI encoded function that you need to run
    to: ADDRESS, // transaction to your deployed contract
  };
  console.log("debugg 1::");
  //-----------------sign the transaction

  const tx = new Transaction(txObject, { chain: "goerli" });
  console.log("debugg 2::", tx);
  tx.sign(Buffer.from(PrivateKey.toString(), "hex"));
  const serializeTx = tx.serialize();
  const rawTx = "0x" + serializeTx.toString("hex");
  console.log("debugg 3::");

  //------------------broadcast the transaction

  // web3.eth.sendSignedTransaction(rawTx, (err, result) => {
  //   console.log("err", err);
  //   console.log("res", result);
  // });

q
  console.log("txSent",result);
  console.log(
    "debug test usdc balance 2:",
    await contract.methods.balanceOf(walletAddress).call()
  );

  // return txSent;
}

Withdraw(
  "0x5C93D5c0bf644EBCD1bd555b944ECf14083882cE",
  process.env.PRIVATE_KEY,
  "0xA39337D502d64056a6D51081032Cc346AE3E057A",
  100
)
  .then((result) => {
    console.log("log for result", result);
  })
  .catch((err) => {
    console.log("log for error", err);
  });
