let web3;
let contract;
let tokenContract;
let user;

const contractAddress = "0x18d9d27fbf87306aefe2a4a9c1d9e62ccb3635f0";
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        document.getElementById("connectWallet").onclick = connectWallet;
        document.getElementById("approveButton").onclick = approve;
        document.getElementById("stakeButton").onclick = stake;
        document.getElementById("claimButton").onclick = claim;
        document.getElementById("unstakeButton").onclick = unstake;
    } else {
        alert("Please install MetaMask.");
    }
};

async function connectWallet() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    user = accounts[0];
    contract = new web3.eth.Contract(stakingABI, contractAddress);
    tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);
    document.getElementById("status").innerText = "Connected: " + user;
}

async function approve() {
    const amount = document.getElementById("stakeAmount").value;
    await tokenContract.methods.approve(contractAddress, web3.utils.toWei('1000000000', "ether")).send({ from: user });
    document.getElementById("status").innerText = "Approve Success!";
}

async function stake() {
    const amount = document.getElementById("stakeAmount").value;
    const duration = document.getElementById("stakeDuration").value;
    const amountWei = web3.utils.toWei(amount, "ether");
    await contract.methods.stake(amountWei, duration).send({ from: user });
    document.getElementById("status").innerText = "Stake Success!";
}

async function claim() {
    const index = document.getElementById("claimIndex").value;
    await contract.methods.claim(index).send({ from: user });
    document.getElementById("status").innerText = "Claim Success!";
}

async function unstake() {
    const index = document.getElementById("claimIndex").value;
    await contract.methods.unstake(index).send({ from: user });
    document.getElementById("status").innerText = "Unstake Success!";
}

const erc20ABI = [
    { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
];
