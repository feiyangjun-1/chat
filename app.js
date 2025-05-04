// 初始化Firebase
// 注意：这些配置将在Firebase设置部分获取
const firebaseConfig = {
  apiKey: "AIzaSyDXbWap93nZD1Ja9pe-10oUEcig4MqvIkk",
  authDomain: "chat-b98b5.firebaseapp.com",
  projectId: "chat-b98b5",
  storageBucket: "chat-b98b5.firebasestorage.app",
  messagingSenderId: "459376694568",
  appId: "1:459376694568:web:7adcb04b873b9c53e6ac1d"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messagesRef = database.ref('messages');

// DOM元素
const chatBox = document.getElementById('chatBox');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');

// 加载消息
messagesRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    displayMessage(message);
});

// 发送消息
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    const username = usernameInput.value.trim() || '匿名用户';
    
    if (message !== '') {
        const newMessage = {
            username: username,
            text: message,
            timestamp: Date.now()
        };
        
        messagesRef.push(newMessage);
        messageInput.value = '';
    }
}

function displayMessage(message) {
    const messageElement = document.createElement('div');
    const currentUsername = usernameInput.value.trim() || '匿名用户';
    
    messageElement.className = `message ${message.username === currentUsername ? 'user' : 'other'}`;
    
    const usernameElement = document.createElement('div');
    usernameElement.className = 'username';
    usernameElement.textContent = message.username;
    
    const textElement = document.createElement('div');
    textElement.className = 'text';
    textElement.textContent = message.text;
    
    const timestampElement = document.createElement('div');
    timestampElement.className = 'timestamp';
    timestampElement.textContent = formatTimestamp(message.timestamp);
    
    messageElement.appendChild(usernameElement);
    messageElement.appendChild(textElement);
    messageElement.appendChild(timestampElement);
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}
