let web3;
let userAccount;

// 檢查是否安裝 MetaMask
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask 已安裝');
    web3 = new Web3(window.ethereum); // 初始化 Web3 物件
} else {
    alert('請安裝 MetaMask 錢包以使用此工具！');
}

// 連接 MetaMask 錢包
async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); // 請求連接錢包
        userAccount = accounts[0]; // 獲取連接的帳戶地址
        alert('已連接錢包地址: ' + userAccount);
        console.log('已連接帳戶:', userAccount);
    } catch (error) {
        console.error('連接錢包失敗', error);
        alert('無法連接錢包，請重試！');
    }
}

// 表單提交事件監聽，執行連接錢包邏輯
document.getElementById('contractForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // 防止表單刷新頁面

    // 如果尚未連接錢包，則先連接錢包
    if (!userAccount) {
        await connectWallet();
    }

    // 獲取用戶輸入的參數
    const contractName = document.getElementById('contractName').value;
    const symbol = document.getElementById('symbol').value;
    const totalSupply = document.getElementById('totalSupply').value;

    // 輸出結果到 Console 進行測試
    console.log('合約名稱:', contractName);
    console.log('代幣符號:', symbol);
    console.log('總供應量:', totalSupply);

    // 顯示暫時彈窗，確認數據已提交
    alert('已提交資料：\n合約名稱: ' + contractName + '\n代幣符號: ' + symbol + '\n總供應量: ' + totalSupply);

    // 下一步：這裡將加入智能合約部署邏輯
});
