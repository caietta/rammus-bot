const { Client, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

const client = new Client();

client.on("qr", (qr) => {
  console.log("Escaneie o seguinte código QR com seu celular:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Cliente está pronto!");
});

client.on("message", async (message) => {
  if (message.body.toLowerCase() === "rafinha") {
    // Envia uma imagem aleatória
    await enviarImagemAleatoria(message.from);
  }
});

client.initialize();

async function enviarImagemAleatoria(chatId) {
  try {
    // Lista todos os arquivos de imagem no diretório 'imagens'
    const imagensDir = path.join(__dirname, "imagens");
    const files = fs.readdirSync(imagensDir);

    // Escolhe aleatoriamente uma imagem da lista
    const randomIndex = Math.floor(Math.random() * files.length);
    const randomImage = files[randomIndex];
    const imagePath = path.join(imagensDir, randomImage);

    // Envia a imagem
    if (fs.existsSync(imagePath)) {
      const media = MessageMedia.fromFilePath(imagePath);
      await client.sendMessage(chatId, media);
    } else {
      console.log("Erro: Arquivo de imagem não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao enviar imagem:", error);
  }
}
