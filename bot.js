const express = require("express");
const { Client, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
const app = express();
const stream = require("stream");
const QRCode = require("qrcode");

const port = 80;
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
async function makeQRCode(qr, res) {
  const qrStream = stream.PassThrough();
  const result = await QRCode.toFileStream(qrStream, qr, {
    type: "png",
    width: 200,
    errorCorrectionLevel: "H",
  });

  qrStream.pipe(res);
}
app.get("/", (req, res) => {
  const client = new Client({
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", (qr) => {
    /* qrcode.generate(qr, { small: true }); */
    makeQRCode(qr, res);
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
});

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
