# 🤖 Tokocrypto AI Trading Bot

> **Bot trading otomatis berbasis AI (Google Gemini) untuk exchange Tokocrypto.**  
> Menganalisa 82+ indikator teknikal, berita crypto, dan sentimen pasar untuk mengeksekusi order BUY/SELL secara langsung di akun Anda.

---

## ✨ Fitur Utama

- 🧠 **AI-Powered** — Analisa mendalam menggunakan Google Gemini AI
- 📊 **82+ Indikator** — RSI, MACD, Bollinger Bands, ADX, TTM Squeeze, OBV, dan lainnya  
- ⏱️ **Multi-Timeframe** — Mendukung 15m, 30m, 1h, 4h, dan lebih
- 💰 **Live Trading** — Eksekusi market order langsung ke Tokocrypto
- 🛡️ **Risk Management** — Stop Loss & Take Profit otomatis dari AI
- 📰 **News Aware** — Mempertimbangkan berita crypto terkini sebelum keputusan
- 🖥️ **Dashboard Web** — Monitor bot via browser di `localhost:8000`
- 🔄 **Auto-Restart** — Bot jalan otomatis di background

---

## 📋 Persyaratan

| Kebutuhan | Keterangan |
|-----------|-----------|
| OS | Ubuntu / Debian / Pop!_OS (Linux) |
| Python | 3.10 atau lebih baru |
| RAM | Minimal 2GB |
| Internet | Wajib (untuk API) |

---

## 🚀 Cara Install

### 1. Clone repo

```bash
git clone https://github.com/paji52203/bot_tokocypto.git
cd bot_tokocypto
```

### 2. Jalankan installer

```bash
chmod +x install.sh && ./install.sh
```

Script ini akan otomatis:
- ✅ Membuat Virtual Environment Python
- ✅ Menginstall semua library yang dibutuhkan
- ✅ Menginformasikan API key yang perlu diisi

### 3. Isi API Keys

```bash
nano keys.env
```

Isi bagian berikut:

```env
TOKOCRYPTO_API_KEY=isi_api_key_tokocrypto_anda
TOKOCRYPTO_API_SECRET=isi_secret_tokocrypto_anda
GOOGLE_STUDIO_API_KEY=isi_google_ai_studio_key_anda
```

#### Cara dapat API Key:

**Tokocrypto API Key:**
1. Login ke [tokocrypto.com](https://www.tokocrypto.com)
2. Profil → API Management → Buat API Key
3. Aktifkan permission: **Read** + **Trade**
4. Simpan Key dan Secret

**Google AI Studio API Key:**
1. Buka [aistudio.google.com](https://aistudio.google.com)
2. Klik **Get API Key** → **Create API key**
3. Salin key-nya

### 4. Sesuaikan konfigurasi (opsional)

```bash
nano config/config.ini
```

```ini
[general]
crypto_pair = BTC/USDT   # Coin yang dipantau
timeframe = 15m           # Interval analisa (15m, 30m, 1h, 4h)
```

### 5. Jalankan bot!

```bash
./run.sh
```

Bot akan langsung aktif dan mulai menganalisa pasar secara otomatis.

---

## 🖥️ Dashboard

Buka browser dan akses:

```
http://localhost:8000
```

Dashboard menampilkan:
- Status bot (aktif/mati)
- Sinyal terakhir (BUY/SELL/HOLD)
- Posisi yang sedang berjalan
- Harga masuk, Stop Loss, Take Profit

---

## 📡 Monitoring Log

Untuk melihat log bot secara real-time:

```bash
tail -f logs/Bot/$(date +%Y_%m_%d)/Bot.log
```

---

## 🛑 Menghentikan Bot

```bash
pkill -f "python3 start.py"
```

---

## ⚙️ Jalankan di Background

Agar bot tetap jalan meski terminal ditutup:

```bash
nohup ./run.sh > /dev/null 2>&1 &
```

---

## ⚠️ Disclaimer

> Bot ini dibuat untuk tujuan edukasi dan eksperimen.  
> **Gunakan dengan risiko Anda sendiri.** Pasar crypto sangat volatil dan bot AI tidak menjamin profit.  
> Selalu gunakan modal yang siap Anda tanggung kerugiannya.

---

## 🔑 Keamanan

- ❌ **JANGAN** commit file `keys.env` ke GitHub
- ❌ **JANGAN** share API Key ke siapapun
- ✅ Gunakan API Key dengan permission **Trade Only** (tanpa Withdraw)
- ✅ Simpan `keys.env` lokal saja

---

## 📦 Struktur Proyek

```
bot_tokocypto/
├── run.sh              # Script launcher utama
├── install.sh          # Installer otomatis
├── keys.env.example    # Template API keys
├── config/
│   └── config.ini      # Konfigurasi bot
├── src/
│   ├── platforms/      # Integrasi Tokocrypto (CCXT)
│   ├── analyzer/       # Mesin analisa AI
│   ├── trading/        # Strategi & risk management
│   └── dashboard/      # Web dashboard
└── QUICKSTART.md       # Panduan singkat
```

---

Made with ❤️ for Tokocrypto traders
