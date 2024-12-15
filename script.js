// 檢查是否安裝 MetaMask
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask 已安裝');
} else {
    alert('請安裝 MetaMask 錢包以使用此工具！');
}

// 捕獲表單參數
document.getElementById('contractForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 防止表單刷新頁面

    const contractName = document.getElementById('contractName').value;
    const symbol = document.getElementById('symbol').value;
    const totalSupply = document.getElementById('totalSupply').value;

    console.log('合約名稱:', contractName);
    console.log('代幣符號:', symbol);
    console.log('總供應量:', totalSupply);

    alert('功能尚未完成：合約名稱 ' + contractName + '，代幣符號 ' + symbol + '，總供應量 ' + totalSupply);
});
