let web3;
let userAccount;

// ERC-20 和 ERC-721 智能合約模板
const contractTemplates = {
    erc20: {
        abi: [
            {
                "inputs": [
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "string", "name": "symbol", "type": "string" },
                    { "internalType": "uint256", "name": "initialSupply", "type": "uint256" }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            }
        ],
        bytecode: "0x608060405234..." // 替換為完整 ERC-20 Bytecode
    },
    erc721: {
        abi: [
            {
                "inputs": [
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "string", "name": "symbol", "type": "string" }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            }
        ],
        bytecode: "0x608060405234..." // 替換為完整 ERC-721 Bytecode
    }
};

// 初始化 Web3
if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    alert('請安裝 MetaMask 錢包以使用此工具！');
}

// 初始化 Firebase
const firebaseConfig = {
    apiKey: "你的API金鑰",
    authDomain: "你的專案域名",
    databaseURL: "你的資料庫URL",
    projectId: "你的專案ID",
    storageBucket: "你的儲存區域",
    messagingSenderId: "你的發送者ID",
    appId: "你的應用程式ID"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 連接 MetaMask 錢包
async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        alert('已連接錢包地址: ' + userAccount);
    } catch (error) {
        console.error('連接錢包失敗', error);
    }
}

// 支付邏輯
async function processPayment() {
    try {
        const paymentAmount = web3.utils.toWei('0.01', 'ether'); // 固定支付金額
        await web3.eth.sendTransaction({
            from: userAccount,
            to: '你的錢包地址', // 替換為接收支付的錢包地址
            value: paymentAmount
        });
        alert('支付成功，開始部署合約...');
    } catch (error) {
        console.error('支付失敗', error);
        alert('支付失敗，請重試！');
        throw error;
    }
}

// 儲存部署記錄到 Firebase
async function saveDeploymentRecord(contractType, contractName, symbol, totalSupply, contractAddress) {
    try {
        await database.ref('deployments/' + userAccount).push({
            contractType,
            contractName,
            symbol,
            totalSupply,
            contractAddress,
            timestamp: Date.now()
        });
        console.log('部署記錄已保存');
    } catch (error) {
        console.error('儲存記錄失敗', error);
    }
}

// 表單提交事件：檢查支付並部署合約
document.getElementById('contractForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const contractType = document.getElementById('contractType').value;
    const contractName = document.getElementById('contractName').value;
    const symbol = document.getElementById('symbol').value;
    const totalSupply = document.getElementById('totalSupply').value;

    if (!userAccount) {
        await connectWallet();
    }

    try {
        // 先進行支付
        await processPayment();

        const { abi, bytecode } = contractTemplates[contractType];
        const contract = new web3.eth.Contract(abi);

        alert('開始部署合約...');
        const result = await contract.deploy({
            data: bytecode,
            arguments: contractType === 'erc20' ? [contractName, symbol, totalSupply] : [contractName, symbol]
        }).send({
            from: userAccount,
            gas: 3000000
        });

        alert('合約成功部署！地址：' + result.options.address);
        console.log('合約地址:', result.options.address);

        // 儲存部署記錄
        await saveDeploymentRecord(contractType, contractName, symbol, totalSupply, result.options.address);
    } catch (error) {
        console.error('操作失敗:', error);
    }
});
