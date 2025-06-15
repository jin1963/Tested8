let web3;
let contract;
let accounts = [];
let tokenContract;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(contractABI, contractAddress);

    const tokenAddress = await contract.methods.token().call();
    tokenContract = new web3.eth.Contract([
      {"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"},
      {"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"type":"function"},
      {"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"}
    ], tokenAddress);

    document.getElementById("app").innerHTML = `
      <p>Wallet: ${accounts[0]}</p>
      <input type="number" id="amount" placeholder="Amount to stake"/>
      <button onclick="stake()">Stake</button>
      <button onclick="claim()">Claim</button>
      <button onclick="withdraw()">Withdraw</button>
    `;
  } else {
    alert("Please install MetaMask.");
  }
});

async function stake() {
  const amount = document.getElementById("amount").value;
  const amountWei = web3.utils.toWei(amount, "ether");

  const allowance = await tokenContract.methods.allowance(accounts[0], contract.options.address).call();
  if (BigInt(allowance) < BigInt(amountWei)) {
    await tokenContract.methods.approve(contract.options.address, web3.utils.toWei("1000000000", "ether")).send({ from: accounts[0] });
  }

  await contract.methods.stake(amountWei).send({ from: accounts[0] });
  alert("Stake Success!");
}

async function claim() {
  await contract.methods.claimReward().send({ from: accounts[0] });
  alert("Claim Success!");
}

async function withdraw() {
  await contract.methods.withdraw().send({ from: accounts[0] });
  alert("Withdraw Success!");
}
