# 3Speak Video Encoder 🎬

A distributed video encoding system that connects to the 3Speak network for processing video encoding jobs. This system uses IPFS for decentralized storage, Ceramic Network for identity management, and FFmpeg for high-quality video processing.

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose** (recommended method)
- **OR** Node.js 16+ for native installation
- Good internet connection for video processing
- Basic command line knowledge

### Option 1: Docker Setup (Recommended)

1. **Clone the repository:**
```bash
git clone https://github.com/eddiespino/video-encoder.git
cd video-encoder
```

2. **Start the services:**
```bash
docker-compose up
```

3. **Configure your node** (after first run, stop with Ctrl+C):
```bash
nano ./data/video-encoder/config
```

Update the configuration:
```json
{
  "node": {
    "name": "your-unique-node-name",
    "privateKey": "[auto-generated - don't change]"
  },
  "gateway_client": {
    "gateway_url": "https://encoder-gateway.infra.3speak.tv"
  },
  "cryptoAccounts": {
    "hive": "your-hive-username"
  }
}
```

4. **Start in production mode:**
```bash
docker-compose up -d
```

5. **Monitor your node:**
```bash
docker-compose logs -f
```

### Option 2: Native Installation

#### System Setup (Ubuntu/Debian)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 16
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs npm -y

# Install FFmpeg
sudo apt install ffmpeg -y

# Install PM2 for process management
npm install -g pm2
```

#### IPFS Installation
```bash
# Download and install Kubo (IPFS)
wget https://dist.ipfs.tech/kubo/v0.18.1/kubo_v0.18.1_linux-amd64.tar.gz
tar -xf kubo_v0.18.1_linux-amd64.tar.gz
cd kubo
chmod +x install.sh
sudo ./install.sh

# Initialize and start IPFS
ipfs init --profile server
pm2 start "ipfs daemon" --name ipfs
```

#### Project Setup
```bash
# Clone and setup
git clone https://github.com/eddiespino/video-encoder.git
cd video-encoder
npm install --force
npm run build

# Start the encoder
pm2 start "npm run start" --name videoEncoder

# Configure auto-startup
pm2 startup
pm2 save
```

#### Configuration (Native)
```bash
# Create config directory
mkdir -p ~/.spk-encoder

# Edit configuration
nano ~/.spk-encoder/config
```

## ⚙️ Configuration Guide

### Required Settings
- **`node.name`**: Unique identifier for your encoding node
- **`gateway_client.gateway_url`**: Must be `"https://encoder-gateway.infra.3speak.tv"`
- **`cryptoAccounts.hive`**: Your Hive username for rewards (optional)

### Environment Variables
```bash
# Optional customization
export MONGO_HOST=localhost:27017
export MONGO_DATABASE=spk-encoder-node
export CERAMIC_HOST=https://ceramic-clay.3boxlabs.com
export IPFS_HOST=localhost:5001
export API_LISTEN_PORT=4005
```

## 🏗️ Architecture

### Core Components
- **Core Service**: Main orchestration and job management
- **Gateway API**: Communication with 3Speak network
- **Encoder Service**: Video processing using FFmpeg
- **IPFS Integration**: Decentralized file storage
- **Ceramic Network**: Decentralized identity management

### How It Works
1. **Registration**: Node connects to 3Speak gateway
2. **Job Polling**: Regularly checks for available encoding jobs
3. **Processing**: Downloads video → Encodes with FFmpeg → Uploads results
4. **Rewards**: Earn tokens based on completed encoding jobs

## 🔧 Development

### Development Commands
```bash
# Development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Run tests
npm test

# Linting
npm run lint
npm run lint:fix
```

### Project Structure
```
src/
├── api/                 # REST API endpoints
├── modules/
│   ├── core/           # Core business logic
│   └── libp2p/         # P2P networking
├── config.service.ts   # Configuration management
└── index.ts           # Application entry point
```

## 📊 Monitoring

### Health Checks
```bash
# Docker logs
docker-compose logs -f spk-video-encoder

# Native PM2 logs
pm2 logs videoEncoder
pm2 status

# IPFS status
ipfs id
```

### Performance Metrics
- Monitor CPU usage during encoding
- Check available disk space
- Network bandwidth for uploads/downloads
- Job completion rates

## 🐛 Troubleshooting

### Common Issues

**IPFS Connection Failed**
```bash
# Check IPFS is running
ipfs id

# Restart IPFS
pm2 restart ipfs
```

**FFmpeg Not Found**
```bash
# Install FFmpeg
sudo apt install ffmpeg  # Linux
brew install ffmpeg       # macOS
```

**Port Conflicts**
- IPFS uses port 4001
- Encoder API uses port 4005
- Check with: `netstat -tulpn | grep :4001`

**Configuration Issues**
- Ensure gateway URL is correct
- Verify node name is unique
- Check file permissions on config

### Log Files
- **Docker**: Container logs via `docker-compose logs`
- **Native**: `~/.pm2/logs/` or check with `pm2 logs`
- **IPFS**: Usually in `~/.ipfs/logs/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

ISC License - see LICENSE file for details

## 🆘 Support

- **Issues**: Open a GitHub issue
- **3Speak Community**: Join the official channels
- **Documentation**: Check the `/docs` folder for detailed guides

## 🎯 Next Steps

1. **Monitor Performance**: Track your node's encoding jobs
2. **Optimize Hardware**: Consider SSD storage and good CPU
3. **Join Community**: Connect with other node operators
4. **Scale Up**: Run multiple encoding nodes if profitable

---

**Ready to start encoding?** Follow the Quick Start guide above! 🚀
