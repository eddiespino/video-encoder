# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the SPK (3Speak Network) Video Encoder, a distributed video processing node that participates in a peer-to-peer network to encode videos for the 3Speak platform. The system combines decentralized identity (Ceramic/DID), IPFS storage, libp2p networking, and FFmpeg-based video encoding.

## Key Technologies & Architecture

### Core Components
- **CoreService** (`src/modules/core/core.service.ts`): Main orchestrator that initializes all subsystems
- **EncoderService**: Handles video encoding jobs using FFmpeg with multiple resolution outputs
- **GatewayService**: Manages job distribution and worker coordination using MongoDB
- **GatewayClient**: Client-side service for requesting and executing encoding jobs
- **Lib2pService**: libp2p networking layer for peer-to-peer communication
- **IdentityService**: Manages DID-based identity using Ceramic network

### Technology Stack
- **Runtime**: Node.js with TypeScript, ES modules
- **Identity**: Ceramic Network, DID (Decentralized Identity)
- **Storage**: IPFS (InterPlanetary File System), IPFS Cluster
- **Database**: MongoDB (gateway), PouchDB (local state)
- **Networking**: libp2p for P2P communication
- **Video Processing**: FFmpeg via fluent-ffmpeg
- **API**: NestJS with GraphQL (Yoga) and REST endpoints
- **Process Management**: PM2 for production deployment

### Data Flow Architecture
1. **Job Creation**: Videos are submitted to the gateway and stored as MongoDB documents
2. **Job Assignment**: Worker nodes request jobs through libp2p or HTTP API
3. **Video Processing**: EncoderService downloads, transcodes to multiple resolutions, and uploads to IPFS
4. **Result Storage**: Encoded videos are pinned to IPFS cluster and job status updated
5. **Rewards**: HIVE blockchain integration for worker rewards

## Development Commands

### Build & Run
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Development mode (builds and runs)
npm run dev

# Production start
npm start

# Run experimental client
npx ts-node client.ts
```

### Code Quality
```bash
# Lint code
npm run lint

# Lint and fix issues
npm run lint:fix

# Run tests with coverage
npm test

# Open coverage report
npm run test:report
```

### Docker Development
```bash
# Build and run with Docker Compose
docker-compose up

# Run in background
docker-compose up -d

# View logs
docker logs spk-video-encoder
```

### Single Test Execution
Since this project uses Jest, run individual test files with:
```bash
# Run specific test file
npx jest path/to/test/file.test.ts

# Run tests matching pattern
npx jest --testNamePattern="specific test name"

# Run tests in watch mode
npx jest --watch
```

## Configuration

### Environment Setup
The application reads configuration from `~/.spk-encoder/config`. Key sections:
- `node.name`: Unique identifier for this encoding node
- `cryptoAccounts.hive`: HIVE username for reward distribution
- `gateway_url`: Gateway server for job coordination (default: gateway.infra.3speak.tv)
- `ceramicHost`: Ceramic network endpoint for DID services

### Required External Services
- **IPFS Node**: Local Kubo instance on port 5001
- **MongoDB**: For gateway mode job storage
- **FFmpeg**: System installation required for video encoding

## Architecture Patterns

### Service-Oriented Design
- All major functionality is encapsulated in service classes
- CoreService acts as dependency injection container and lifecycle manager
- Services communicate via EventEmitter for loose coupling

### Dual Operating Modes
1. **Gateway Mode**: Coordinates job distribution, maintains worker registry
2. **Worker Mode**: Requests jobs, performs encoding, reports results

### Asynchronous Job Processing
- PQueue for concurrent job execution with configurable limits
- PouchDB for local job state persistence
- MongoDB for distributed job coordination

### Identity & Networking
- DID-based identity using Ceramic network for trustless peer identification
- libp2p for direct peer-to-peer communication
- HTTP fallback for gateway communication

### Video Processing Pipeline
- Multi-resolution encoding (144p to 4K) with adaptive bitrates
- HLS streaming format support
- Automatic resolution detection and optimal encoding parameters
- Progress tracking and status updates throughout processing

## Key Files

### Entry Points
- `src/index.ts`: Application bootstrap and lifecycle management
- `client.ts`: Experimental client for testing
- `src/api/index.ts`: NestJS API module with GraphQL and REST endpoints

### Core Services
- `src/modules/core/`: All major service implementations
- `src/modules/encoder.model.ts`: TypeScript interfaces and enums
- `src/config.service.ts`: Configuration management
- `src/common/utils.ts`: Shared utilities

### Development
- `tsconfig.json`: ES2020 target, ES modules, decorators enabled
- `.eslintrc.js`: TypeScript ESLint with Prettier integration
- `jest.config.js`: Test configuration
- `ecosystem.config.js`: PM2 process configuration

## Dependencies Note

This project uses `--legacy-peer-deps` flag due to dependency conflicts in the IPFS/libp2p ecosystem. When adding new dependencies, be aware of potential peer dependency issues with:
- IPFS HTTP client versions
- libp2p module compatibility
- Ceramic network packages

## Deployment Considerations

### Production Deployment
- Use PM2 for process management and auto-restart
- Configure proper IPFS node with adequate resources
- Set up MongoDB with appropriate indexing for job queries
- Ensure FFmpeg is properly installed with required codecs

### Resource Requirements
- Adequate CPU for video encoding workloads
- Sufficient disk space for temporary video files
- Reliable network connectivity for IPFS operations
- Memory allocation for concurrent job processing
