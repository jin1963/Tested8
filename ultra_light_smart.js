let web3;
let contract;
let token;
let account;

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        document.getElementById("walletAddress").innerText = account;

        contract = new web3.eth.Contract(stakingABI, contractAddress);
        token = new web3.eth.Contract([
            {"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"},
            {"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"type":"function"},
            {"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"}
        ], tokenAddress);
    }
});

document.getElementById("stakeBtn").onclick = async () => {
    const amount = document.getElementById("amountInput").value;
    const tier = document.getElementById("tierSelect").value;
    const amountWei = web3.utils.toWei(amount, "ether");

    const allowance = await token.methods.allowance(account, contractAddress).call();
    if (BigInt(allowance) < BigInt(amountWei)) {
        await token.methods.approve(contractAddress, web3.utils.toTwosComplement(-1)).send({ from: account });
    }
    await contract.methods.stake(amountWei, tier).send({ from: account });
    alert("✅ Staked Successfully!");
};

document.getElementById("claimBtn").onclick = async () => {
    const index = document.getElementById("stakeIndexInput").value;
    await contract.methods.claim(index).send({ from: account });
    alert("✅ Claimed!");
};

document.getElementById("unstakeBtn").onclick = async () => {
    const index = document.getElementById("stakeIndexInput").value;
    await contract.methods.unstake(index).send({ from: account });
    alert("✅ Unstaked!");
};
