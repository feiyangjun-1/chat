# 保存为 app.py 并运行
import os
import sqlite3
from datetime import datetime
from flask import Flask, render_template_string, request
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64
from hashids import Hashids

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['DATABASE'] = 'messages.db'
app.config['AES_KEY'] = 'this-is-a-secret-key-1234567890abcdef'  # 必须32字节

hashids = Hashids(salt=app.config['SECRET_KEY'], min_length=4)

# 初始化数据库
def init_db():
    with sqlite3.connect(app.config['DATABASE']) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                encrypted_content TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        ''')

init_db()

# 加密函数
def encrypt_message(message):
    key = app.config['AES_KEY'].encode('utf-8')
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return base64.b64encode(iv + cipher.encrypt(pad(message.encode('utf-8'), AES.block_size))).decode('utf-8')

# 解密函数
def decrypt_message(encrypted):
    data = base64.b64decode(encrypted)
    key = app.config['AES_KEY'].encode('utf-8')
    return unpad(AES.new(key, AES.MODE_CBC, iv=data[:16]).decrypt(data[16:]), AES.block_size).decode('utf-8')

