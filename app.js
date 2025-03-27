const { WebcastPushConnection } = require('tiktok-live-connector');
const { ProxyAgent } = require('proxy-agent');
const fs = require('fs');

const logFile = fs.createWriteStream('site.log', { flags: 'a' });

const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  logFile.write(logMessage);
  process.stdout.write(logMessage);
};

async function startTikTokLive() {
  try {
    const proxy = 'http://14.229.249.242:8080';
    const agent = new ProxyAgent(proxy);

    const tiktokLiveConnection = new WebcastPushConnection('@1lenhan');

    tiktokLiveConnection.on('connected', () => {
      console.log(`✅ Connected! Room ID: ${tiktokLiveConnection.roomId}`);
      logToFile(`✅ Connected! Room ID: ${tiktokLiveConnection.roomId}`);
    });

    tiktokLiveConnection.on('chat', (data) => {
      logToFile(`💬 ${data.uniqueId}: ${data.comment}`);
    });

    tiktokLiveConnection.on('gift', (data) => {
      logToFile(`🎁 ${data.uniqueId}: Sent ${data.giftName}`);
    });

    tiktokLiveConnection.on('streamEnd', () => {
      logToFile(`⚠️ Stream ended for @z9pubg`);
    });

    tiktokLiveConnection.on('error', (err) => {
      logToFile(`❗ Error: ${err.message}`);
    });

    await tiktokLiveConnection.connect();

  } catch (error) {
    console.error("❗ Lỗi kết nối:", error);
    logToFile(`❗ Lỗi kết nối: ${error.message}`);
  }
}

startTikTokLive();
