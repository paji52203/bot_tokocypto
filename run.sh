#!/bin/bash

# Folder environment
VENV_DIR="venv"

# 1. Buat venv jika belum ada
if [ ! -d "$VENV_DIR" ]; then
    echo "📦 Membuat Virtual Environment baru..."
    python3 -m venv $VENV_DIR
    echo "📥 Install dependensi (sekali saja)..."
    source $VENV_DIR/bin/activate
    pip3 install -r requirements.txt
else
    source $VENV_DIR/bin/activate
fi

# 2. Bunuh instance lama jika ada
pkill -f "python3 start.py" 2>/dev/null
fuser -k 8000/tcp 2>/dev/null
sleep 1

# 3. Langsung jalankan bot (auto-start AI Engine)
echo "🚀 Meluncurkan Tokocrypto AI Trading Bot..."
python3 start.py
