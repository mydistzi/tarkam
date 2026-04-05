import fs from "node:fs";
import path from "node:path";
import { createHash, createHmac } from "node:crypto";
import { fileURLToPath } from "node:url";

import express from "express";
import makeWASocket, {
  DisconnectReason,
  downloadMediaMessage,
  fetchLatestBaileysVersion,
  proto,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import pino from "pino";
import QRCode from "qrcode";
import qrcode from "qrcode-terminal";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const BAILEYS_DATA_DIR = path.resolve(
  process.env.BAILEYS_DATA_DIR || path.join(ROOT_DIR, ".baileys-data")
);
const AUTH_DIR = path.resolve(
  process.env.BAILEYS_AUTH_DIR || path.join(BAILEYS_DATA_DIR, "auth")
);
const STATE_DIR = path.resolve(
  process.env.BAILEYS_STATE_DIR || path.join(BAILEYS_DATA_DIR, "state")
);
const HOSTED_MEDIA_DIR = path.resolve(
  process.env.BAILEYS_HOSTED_MEDIA_DIR || path.join(STATE_DIR, "hosted-media")
);
const QR_DIR = path.resolve(
  process.env.BAILEYS_QR_DIR || path.join(STATE_DIR, "qr")
);
const CURRENT_QR_IMAGE_FILE = path.resolve(
  process.env.BAILEYS_QR_IMAGE_FILE || path.join(QR_DIR, "current-qr.png")
);
const SENT_MESSAGE_INDEX_FILE = path.resolve(
  process.env.BAILEYS_SENT_MESSAGE_INDEX_FILE || path.join(STATE_DIR, "sent-message-index.json")
);
const CONTACT_INDEX_FILE = path.resolve(
  process.env.BAILEYS_CONTACT_INDEX_FILE || path.join(STATE_DIR, "contacts.json")
);

const HOST = process.env.BAILEYS_HOST || process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.BAILEYS_PORT || process.env.PORT || 3010);
const API_TOKEN = (process.env.BAILEYS_API_TOKEN || "").trim();
const TARKAM_BOT_WEBHOOK_URL = (
  process.env.TARKAM_BOT_WEBHOOK_URL || "http://127.0.0.1:5000/webhook"
).trim();
const TARKAM_BOT_WEBHOOK_SECRET = (
  process.env.TARKAM_BOT_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || ""
).trim();
const BAILEYS_LOG_LEVEL = process.env.BAILEYS_LOG_LEVEL || "silent";
const MAX_MESSAGE_CACHE_SIZE = Number(process.env.BAILEYS_MESSAGE_CACHE_SIZE || 1000);
const HOSTED_MEDIA_MAX_AGE_MS = Number(process.env.BAILEYS_HOSTED_MEDIA_MAX_AGE_MS || 300000);
const NSFW_GROUP_STATUS_CACHE_TTL_MS = Number(process.env.BAILEYS_NSFW_GROUP_STATUS_CACHE_TTL_MS || 60000);

function readTrimmedEnv(name) {
  return String(process.env[name] || "").trim();
}

function isLoopbackUrl(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return ["127.0.0.1", "localhost", "0.0.0.0", "::1"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

function resolveBaileysPublicBaseUrl() {
  const explicit = readTrimmedEnv("BAILEYS_PUBLIC_BASE_URL");
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  if (isLoopbackUrl(TARKAM_BOT_WEBHOOK_URL)) {
    return `http://127.0.0.1:${PORT}`;
  }

  return "";
}

const BAILEYS_PUBLIC_BASE_URL = resolveBaileysPublicBaseUrl();

const logger = pino({
  level: BAILEYS_LOG_LEVEL,
});

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    logger.warn(
      {
        method: req.method,
        path: req.originalUrl,
      },
      "Rejected malformed JSON payload"
    );
    res.status(400).json({
      success: false,
      error: "Invalid JSON payload.",
    });
    return;
  }

  next(error);
});

fs.mkdirSync(AUTH_DIR, { recursive: true });
fs.mkdirSync(STATE_DIR, { recursive: true });
fs.mkdirSync(HOSTED_MEDIA_DIR, { recursive: true });
fs.mkdirSync(QR_DIR, { recursive: true });

app.use(
  "/hosted-media",
  express.static(HOSTED_MEDIA_DIR, {
    fallthrough: false,
    etag: false,
    maxAge: Math.max(HOSTED_MEDIA_MAX_AGE_MS, 0),
  })
);

const sentMessageIndex = loadJsonFile(SENT_MESSAGE_INDEX_FILE, {});
const contactIndex = loadJsonFile(CONTACT_INDEX_FILE, {});
const liveMessageCache = new Map();

let sock;
let currentQr = null;
let connectionState = "connecting";
let lastDisconnectInfo = null;
let lastPrintedQr = null;
let hostedMediaWarningLogged = false;
const nsfwGroupStatusCache = new Map();

function loadJsonFile(filePath, fallbackValue) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallbackValue;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    logger.warn({ err: error, filePath }, "Failed to load JSON file, using fallback");
    return fallbackValue;
  }
}

function saveJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function printQrToTerminal(qrValue) {
  const qrText = String(qrValue || "").trim();
  if (!qrText || qrText === lastPrintedQr) {
    return;
  }

  lastPrintedQr = qrText;
  logger.info("WhatsApp QR updated. Scan the QR shown below in your terminal.");
  qrcode.generate(qrText, { small: true });
}

async function saveQrToPng(qrValue) {
  const qrText = String(qrValue || "").trim();
  if (!qrText) {
    return;
  }

  fs.mkdirSync(QR_DIR, { recursive: true });
  await QRCode.toFile(CURRENT_QR_IMAGE_FILE, qrText, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
    type: "png",
  });
}

function clearSavedQrPng() {
  try {
    if (fs.existsSync(CURRENT_QR_IMAGE_FILE)) {
      fs.unlinkSync(CURRENT_QR_IMAGE_FILE);
    }
  } catch (error) {
    logger.warn({ err: error, file: CURRENT_QR_IMAGE_FILE }, "Failed to remove saved QR PNG");
  }
}

function normalizePhone(value) {
  const raw = String(value || "").replace(/\s+/g, "").trim();
  if (!raw) {
    return "";
  }
  if (raw.endsWith("@g.us") || raw.endsWith("@s.whatsapp.net") || raw.endsWith("@lid")) {
    return raw;
  }
  const withoutPlus = raw.startsWith("+") ? raw.slice(1) : raw;
  return `${withoutPlus}@s.whatsapp.net`;
}

function plainPhone(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/^\+/, "")
    .replace(/@s\.whatsapp\.net$/, "")
    .replace(/@g\.us$/, "")
    .replace(/@lid$/, "");
}

function normalizeJidCandidate(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  const [userPart, domain = ""] = raw.split("@");
  const bareUser = userPart.split(":")[0];
  return domain ? `${bareUser}@${domain}` : bareUser;
}

function buildOwnJidCandidates() {
  const candidates = new Set();
  const values = [
    sock?.user?.id,
    sock?.user?.lid,
  ];

  for (const value of values) {
    const raw = String(value || "").trim();
    const normalized = normalizeJidCandidate(raw);
    if (raw) {
      candidates.add(raw);
    }
    if (normalized) {
      candidates.add(normalized);
    }
  }

  return candidates;
}

function isOwnJid(value) {
  const raw = String(value || "").trim();
  const normalized = normalizeJidCandidate(raw);
  const candidates = buildOwnJidCandidates();
  return candidates.has(raw) || candidates.has(normalized);
}

function detectMessageType(messageContent) {
  const normalizedContent = unwrapMessageContent(messageContent);
  if (!normalizedContent || typeof normalizedContent !== "object") {
    return null;
  }
  return Object.keys(normalizedContent)[0] || null;
}

function unwrapMessageContent(messageContent) {
  if (!messageContent || typeof messageContent !== "object") {
    return null;
  }

  if (messageContent.ephemeralMessage?.message) {
    return unwrapMessageContent(messageContent.ephemeralMessage.message);
  }
  if (messageContent.viewOnceMessage?.message) {
    return unwrapMessageContent(messageContent.viewOnceMessage.message);
  }
  if (messageContent.viewOnceMessageV2?.message) {
    return unwrapMessageContent(messageContent.viewOnceMessageV2.message);
  }
  if (messageContent.viewOnceMessageV2Extension?.message) {
    return unwrapMessageContent(messageContent.viewOnceMessageV2Extension.message);
  }
  if (messageContent.documentWithCaptionMessage?.message) {
    return unwrapMessageContent(messageContent.documentWithCaptionMessage.message);
  }

  return messageContent;
}

function extractMessageText(messageContent) {
  const normalizedContent = unwrapMessageContent(messageContent);
  if (!normalizedContent || typeof normalizedContent !== "object") {
    return "";
  }

  if (typeof normalizedContent.conversation === "string") {
    return normalizedContent.conversation;
  }
  if (typeof normalizedContent.extendedTextMessage?.text === "string") {
    return normalizedContent.extendedTextMessage.text;
  }
  if (typeof normalizedContent.imageMessage?.caption === "string") {
    return normalizedContent.imageMessage.caption;
  }
  if (typeof normalizedContent.videoMessage?.caption === "string") {
    return normalizedContent.videoMessage.caption;
  }
  if (typeof normalizedContent.buttonsResponseMessage?.selectedButtonId === "string") {
    return normalizedContent.buttonsResponseMessage.selectedButtonId;
  }
  if (typeof normalizedContent.listResponseMessage?.title === "string") {
    return normalizedContent.listResponseMessage.title;
  }
  if (typeof normalizedContent.reactionMessage?.text === "string") {
    return normalizedContent.reactionMessage.text;
  }

  return "";
}

function toEpochMilliseconds(value) {
  if (!value) {
    return Date.now();
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return Date.now();
  }
  if (numeric < 1_000_000_000_000) {
    return Math.floor(numeric * 1000);
  }
  return Math.floor(numeric);
}

function guessMediaExtension(mimeType, fallbackExtension = ".bin") {
  const normalizedMime = String(mimeType || "").split(";")[0].trim().toLowerCase();
  const extensionMap = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "video/quicktime": ".mov",
    "video/webm": ".webm",
  };
  return extensionMap[normalizedMime] || fallbackExtension;
}

function buildHostedMediaUrl(fileName) {
  if (!BAILEYS_PUBLIC_BASE_URL) {
    return "";
  }
  return `${BAILEYS_PUBLIC_BASE_URL}/hosted-media/${encodeURIComponent(fileName)}`;
}

function cleanupHostedMediaDir(maxAgeMs = HOSTED_MEDIA_MAX_AGE_MS) {
  const now = Date.now();
  try {
    for (const fileName of fs.readdirSync(HOSTED_MEDIA_DIR)) {
      const filePath = path.join(HOSTED_MEDIA_DIR, fileName);
      const stats = fs.statSync(filePath, { throwIfNoEntry: false });
      if (!stats?.isFile()) {
        continue;
      }
      if (now - stats.mtimeMs > maxAgeMs) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          logger.warn({ err: error, filePath }, "Failed to clean stale hosted media");
        }
      }
    }
  } catch (error) {
    logger.warn({ err: error, dir: HOSTED_MEDIA_DIR }, "Failed to scan hosted media directory");
  }
}

function buildGroupNsfwStatusUrl(groupId) {
  try {
    return new URL(`/api/whatsapp/nsfw-groups/${encodeURIComponent(groupId)}`, TARKAM_BOT_WEBHOOK_URL).toString();
  } catch {
    return "";
  }
}

async function isGroupNsfwModerationEnabled(groupId) {
  const normalizedGroupId = normalizePhone(groupId);
  if (!normalizedGroupId.endsWith("@g.us")) {
    return false;
  }

  const now = Date.now();
  const cached = nsfwGroupStatusCache.get(normalizedGroupId);
  if (cached && now - cached.checkedAt < NSFW_GROUP_STATUS_CACHE_TTL_MS) {
    return Boolean(cached.enabled);
  }

  const statusUrl = buildGroupNsfwStatusUrl(normalizedGroupId);
  if (!statusUrl) {
    return false;
  }

  const headers = {
    Accept: "application/json",
  };
  if (API_TOKEN) {
    headers.Authorization = `Bearer ${API_TOKEN}`;
  }

  try {
    const response = await fetch(statusUrl, {
      method: "GET",
      headers,
    });
    if (!response.ok) {
      logger.warn(
        {
          groupId: normalizedGroupId,
          status: response.status,
          statusUrl,
        },
        "Failed to fetch WhatsApp NSFW moderation state from tarkam-bot"
      );
      nsfwGroupStatusCache.set(normalizedGroupId, {
        enabled: false,
        checkedAt: now,
      });
      return false;
    }

    const payload = await response.json();
    const enabled = Boolean(payload?.enabled);
    nsfwGroupStatusCache.set(normalizedGroupId, {
      enabled,
      checkedAt: now,
    });
    return enabled;
  } catch (error) {
    logger.warn(
      {
        err: error,
        groupId: normalizedGroupId,
        statusUrl,
      },
      "Failed to check WhatsApp NSFW moderation state from tarkam-bot"
    );
    nsfwGroupStatusCache.set(normalizedGroupId, {
      enabled: false,
      checkedAt: now,
    });
    return false;
  }
}

async function maybeStoreIncomingMedia(message) {
  if (!BAILEYS_PUBLIC_BASE_URL) {
    if (!hostedMediaWarningLogged) {
      hostedMediaWarningLogged = true;
      logger.warn(
        {
          webhookTarget: TARKAM_BOT_WEBHOOK_URL,
        },
        "Skipping hosted media generation because BAILEYS_PUBLIC_BASE_URL is unset and no local bot webhook target was detected"
      );
    }
    return null;
  }

  const remoteJid = String(message?.key?.remoteJid || "").trim();
  if (!remoteJid.endsWith("@g.us")) {
    return null;
  }
  if (!(await isGroupNsfwModerationEnabled(remoteJid))) {
    return null;
  }

  const normalizedMessage = unwrapMessageContent(message?.message);
  const messageType = detectMessageType(normalizedMessage);
  if (!normalizedMessage || !["imageMessage", "videoMessage", "stickerMessage"].includes(messageType || "")) {
    return null;
  }

  const mediaNode = normalizedMessage?.[messageType];
  if (!mediaNode || typeof mediaNode !== "object") {
    return null;
  }

  const fallbackExtension = messageType === "videoMessage"
    ? ".mp4"
    : messageType === "stickerMessage"
      ? ".webp"
      : ".jpg";
  const mimeType = String(mediaNode.mimetype || "").trim().toLowerCase()
    || (messageType === "videoMessage" ? "video/mp4" : messageType === "stickerMessage" ? "image/webp" : "image/jpeg");

  try {
    const downloaded = await downloadMediaMessage(
      message,
      "buffer",
      {},
      {
        logger,
        reuploadRequest: sock.updateMediaMessage,
      }
    );
    const mediaBuffer = Buffer.isBuffer(downloaded) ? downloaded : Buffer.from(downloaded || []);
    if (!mediaBuffer.length) {
      return null;
    }

    cleanupHostedMediaDir();
    const digest = createHash("sha1").update(mediaBuffer).digest("hex").slice(0, 16);
    const extension = guessMediaExtension(mimeType, fallbackExtension);
    const fileName = `${Date.now()}-${digest}${extension}`;
    const filePath = path.join(HOSTED_MEDIA_DIR, fileName);
    fs.writeFileSync(filePath, mediaBuffer);

    return {
      mediaUrl: buildHostedMediaUrl(fileName),
      mediaMimeType: mimeType,
      mediaFileName: String(mediaNode.fileName || fileName).trim() || fileName,
    };
  } catch (error) {
    logger.warn(
      {
        err: error,
        messageId: message?.key?.id || null,
        remoteJid: message?.key?.remoteJid || null,
        messageType,
      },
      "Failed to store incoming WhatsApp media for moderation"
    );
    return null;
  }
}

function rememberContact(jid, updates = {}) {
  const normalizedJid = normalizePhone(jid);
  if (!normalizedJid || normalizedJid.endsWith("@g.us")) {
    return;
  }

  const merged = {
    jid: normalizedJid,
    phone: plainPhone(normalizedJid),
    name: updates.name || contactIndex[normalizedJid]?.name || null,
    pushName: updates.pushName || contactIndex[normalizedJid]?.pushName || null,
    shortName: updates.shortName || contactIndex[normalizedJid]?.shortName || null,
    lastSeenAt: Date.now(),
  };

  contactIndex[normalizedJid] = merged;
  saveJsonFile(CONTACT_INDEX_FILE, contactIndex);
}

function rememberMessage(message, { persistSentIndex = false } = {}) {
  const messageId = message?.key?.id;
  if (!messageId) {
    return;
  }

  liveMessageCache.set(messageId, message);
  if (liveMessageCache.size > MAX_MESSAGE_CACHE_SIZE) {
    const oldestKey = liveMessageCache.keys().next().value;
    if (oldestKey) {
      liveMessageCache.delete(oldestKey);
    }
  }

  const shouldPersistRecord = persistSentIndex || Boolean(message?.key?.remoteJid);
  if (shouldPersistRecord) {
    sentMessageIndex[messageId] = {
      id: messageId,
      remoteJid: message?.key?.remoteJid || null,
      participant: message?.key?.participant || null,
      fromMe: Boolean(message?.key?.fromMe ?? false),
      timestamp: toEpochMilliseconds(message?.messageTimestamp),
      message: message?.message || null,
    };

    const entries = Object.entries(sentMessageIndex)
      .sort(([, left], [, right]) => Number(right?.timestamp || 0) - Number(left?.timestamp || 0));
    for (const [staleMessageId] of entries.slice(MAX_MESSAGE_CACHE_SIZE)) {
      delete sentMessageIndex[staleMessageId];
    }

    saveJsonFile(SENT_MESSAGE_INDEX_FILE, sentMessageIndex);
  }
}

function getStoredMessageRecord(messageId) {
  if (!messageId) {
    return null;
  }

  const liveMessage = liveMessageCache.get(messageId);
  if (liveMessage?.key?.remoteJid) {
    return {
      id: liveMessage.key.id,
      remoteJid: liveMessage.key.remoteJid,
      participant: liveMessage.key.participant || null,
      fromMe: Boolean(liveMessage.key.fromMe),
      liveMessage,
    };
  }

  const stored = sentMessageIndex[messageId];
  if (!stored?.remoteJid) {
    return null;
  }

  return {
    ...stored,
    liveMessage: liveMessage || null,
  };
}

function buildQuotedMessage(replyTo) {
  const messageId = String(replyTo || "").trim();
  if (!messageId) {
    return null;
  }

  const record = getStoredMessageRecord(messageId);
  if (!record) {
    return null;
  }

  if (record.liveMessage) {
    return proto.WebMessageInfo.fromObject(record.liveMessage);
  }

  return proto.WebMessageInfo.fromObject({
    key: {
      id: record.id,
      remoteJid: record.remoteJid,
      fromMe: Boolean(record.fromMe),
      participant: record.participant || undefined,
    },
    message: record.message || {
      conversation: "",
    },
  });
}

function buildReplyContextInfo(record) {
  if (!record?.id || !record?.remoteJid) {
    return undefined;
  }

  return {
    stanzaId: record.id,
    participant: record.participant || record.remoteJid,
    remoteJid: record.remoteJid,
    quotedMessage: record.liveMessage?.message || record.message || { conversation: "" },
  };
}

function buildMessageKey(record, { forceFromMe = true } = {}) {
  return {
    id: record.id,
    remoteJid: record.remoteJid,
    fromMe: forceFromMe ? true : Boolean(record.fromMe),
    participant: record.participant || undefined,
  };
}

async function normalizeIncomingPayload(message) {
  const remoteJid = String(message?.key?.remoteJid || "").trim();
  const participantJid = String(message?.key?.participant || message?.key?.senderPn || "").trim();
  const senderJid = participantJid || remoteJid;
  const isGroup = remoteJid.endsWith("@g.us");
  const messageBody = extractMessageText(message?.message);
  const pushName = message?.pushName || contactIndex[senderJid]?.name || contactIndex[senderJid]?.pushName || plainPhone(senderJid);
  const timestamp = toEpochMilliseconds(message?.messageTimestamp);
  const reactionMessage = message?.message?.reactionMessage;
  let normalizedMessage = unwrapMessageContent(message?.message) || {};
  const storedMedia = await maybeStoreIncomingMedia(message);

  if (reactionMessage?.key && typeof reactionMessage.key === "object") {
    const reactionTarget = reactionMessage.key;
    const derivedFromMe = Boolean(reactionTarget.fromMe)
      || isOwnJid(reactionTarget.participant)
      || (!reactionTarget.participant && isOwnJid(reactionTarget.remoteJid));

    normalizedMessage = {
      ...normalizedMessage,
      reactionMessage: {
        ...reactionMessage,
        key: {
          ...reactionTarget,
          fromMe: derivedFromMe,
        },
      },
    };
  }

  return {
    event: isGroup ? "messages-group.received" : "messages.upsert",
    provider: "baileys",
    timestamp,
    data: {
      messages: {
        key: {
          id: message?.key?.id || null,
          msgId: message?.key?.id || null,
          remoteJid,
          fromMe: Boolean(message?.key?.fromMe),
          participant: participantJid || undefined,
          cleanedSenderPn: plainPhone(senderJid),
          cleanedParticipantPn: participantJid ? plainPhone(participantJid) : undefined,
        },
        remoteJid,
        msgId: message?.key?.id || null,
        messageId: message?.key?.id || null,
        messageTimestamp: timestamp,
        pushName,
        messageType: detectMessageType(normalizedMessage),
        messageBody,
        mediaUrl: storedMedia?.mediaUrl || null,
        mediaMimeType: storedMedia?.mediaMimeType || null,
        mediaFileName: storedMedia?.mediaFileName || null,
        message: normalizedMessage,
      },
    },
  };
}

async function forwardIncomingMessageToTarkamBot(payload) {
  const rawPayload = JSON.stringify(payload);
  const headers = {
    "Content-Type": "application/json",
    "X-WhatsApp-Provider": "baileys",
  };

  if (TARKAM_BOT_WEBHOOK_SECRET) {
    headers["X-Webhook-Signature"] = createHmac("sha256", TARKAM_BOT_WEBHOOK_SECRET)
      .update(rawPayload)
      .digest("hex");
  }

  const response = await fetch(TARKAM_BOT_WEBHOOK_URL, {
    method: "POST",
    headers,
    body: rawPayload,
  });

  if (!response.ok) {
    const responseText = await response.text();
    logger.warn(
      {
        webhookTarget: TARKAM_BOT_WEBHOOK_URL,
        status: response.status,
        response: responseText.slice(0, 300),
      },
      "Forwarding incoming Baileys webhook to tarkam-bot returned an unexpected status"
    );
  }
}

async function handleMessagesUpsert(event) {
  const messages = Array.isArray(event?.messages) ? event.messages : [];

  for (const message of messages) {
    if (!message?.key?.id || !message?.key?.remoteJid) {
      continue;
    }

    const senderJid = message?.key?.participant || message?.key?.remoteJid;
    if (senderJid) {
      rememberContact(senderJid, {
        name: message?.pushName || null,
        pushName: message?.pushName || null,
      });
    }

    rememberMessage(message, { persistSentIndex: Boolean(message?.key?.fromMe) });

    if (message?.key?.fromMe) {
      continue;
    }

    if (String(message.key.remoteJid).trim() === "status@broadcast") {
      continue;
    }

    try {
      await forwardIncomingMessageToTarkamBot(await normalizeIncomingPayload(message));
    } catch (error) {
      logger.warn(
        {
          err: error,
          webhookTarget: TARKAM_BOT_WEBHOOK_URL,
          messageId: message?.key?.id || null,
          remoteJid: message?.key?.remoteJid || null,
        },
        "Failed to forward incoming Baileys message to tarkam-bot"
      );
    }
  }
}

async function handleGroupParticipantsUpdate(update = {}) {
  const action = String(update?.action || "").trim().toLowerCase();
  if (!["add", "invite", "join"].includes(action)) {
    return;
  }

  const groupId = String(update?.id || "").trim();
  if (!groupId || !groupId.endsWith("@g.us")) {
    return;
  }

  const participants = Array.isArray(update?.participants)
    ? update.participants.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  const ownParticipants = participants.filter((value) => isOwnJid(value));
  if (ownParticipants.length === 0) {
    return;
  }

  const payload = {
    event: "group.joined",
    data: {
      id: groupId,
      action,
      self: true,
      own: true,
      group: {
        id: groupId,
        subject: update?.subject || null,
      },
      participants,
      ownParticipants,
      update,
    },
  };

  try {
    await forwardIncomingMessageToTarkamBot(payload);
  } catch (error) {
    logger.warn({ err: error, groupId, action }, "Failed to forward Baileys group join event to tarkam-bot");
  }
}

function ensureSocketReady() {
  if (!sock) {
    const error = new Error("Baileys socket is not initialized yet.");
    error.statusCode = 503;
    throw error;
  }

  if (connectionState !== "open") {
    const error = new Error("Baileys socket is not connected yet.");
    error.statusCode = 503;
    throw error;
  }

  return sock;
}

function requireApiToken(req, res, next) {
  if (!API_TOKEN) {
    next();
    return;
  }

  const authorization = String(req.get("Authorization") || "").trim();
  if (authorization === `Bearer ${API_TOKEN}`) {
    next();
    return;
  }

  res.status(401).json({
    success: false,
    error: "Unauthorized",
  });
}

function buildContactVcard(contact = {}) {
  const phone = plainPhone(contact.phone || "");
  const displayName = contact.name || contact.displayName || phone || "Contact";

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${displayName}`,
    phone ? `TEL;type=CELL;type=VOICE;waid=${phone}:${phone}` : null,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildMessageContent(payload, quotedRecord = null) {
  const normalizedMentions = Array.isArray(payload?.mentions)
    ? payload.mentions.map((value) => normalizePhone(value)).filter(Boolean)
    : [];

  const contextInfo = buildReplyContextInfo(quotedRecord);
  const baseContent = {};
  if (normalizedMentions.length > 0) {
    baseContent.mentions = normalizedMentions;
  }
  if (contextInfo) {
    baseContent.contextInfo = contextInfo;
  }

  if (payload?.imageUrl) {
    return {
      ...baseContent,
      image: { url: payload.imageUrl },
      caption: payload.text || "",
    };
  }

  if (payload?.videoUrl) {
    return {
      ...baseContent,
      video: { url: payload.videoUrl },
      caption: payload.text || "",
    };
  }

  if (payload?.documentUrl) {
    return {
      ...baseContent,
      document: { url: payload.documentUrl },
      caption: payload.text || "",
      fileName: payload.fileName || "document",
      mimetype: payload.mimeType || "application/octet-stream",
    };
  }

  if (payload?.audioUrl) {
    return {
      ...baseContent,
      audio: { url: payload.audioUrl },
      mimetype: payload.mimeType || "audio/mpeg",
      ptt: Boolean(payload?.ptt),
    };
  }

  if (payload?.stickerUrl) {
    return {
      sticker: { url: payload.stickerUrl },
    };
  }

  if (payload?.contact) {
    const displayName = payload.contact.name || payload.text || "Contact";
    return {
      contacts: {
        displayName,
        contacts: [
          {
            displayName,
            vcard: payload.contact.vcard || buildContactVcard(payload.contact),
          },
        ],
      },
    };
  }

  if (payload?.location) {
    return {
      location: {
        degreesLatitude: Number(payload.location.latitude || payload.location.degreesLatitude || 0),
        degreesLongitude: Number(payload.location.longitude || payload.location.degreesLongitude || 0),
        name: payload.location.name || undefined,
        address: payload.location.address || undefined,
      },
    };
  }

  return {
    ...baseContent,
    text: payload?.text || "",
  };
}

async function sendMessageWithProvider(payload) {
  const activeSocket = ensureSocketReady();
  const remoteJid = normalizePhone(payload?.to);

  if (!remoteJid) {
    const error = new Error("Field 'to' is required.");
    error.statusCode = 422;
    throw error;
  }

  const quotedRecord = getStoredMessageRecord(payload?.replyTo);
  const messageContent = buildMessageContent(payload, quotedRecord);
  const quotedMessage = buildQuotedMessage(payload?.replyTo);
  const sentMessage = await activeSocket.sendMessage(
    remoteJid,
    messageContent,
    quotedMessage ? { quoted: quotedMessage } : undefined
  );

  rememberMessage(sentMessage, { persistSentIndex: true });

  return {
    success: true,
    data: {
      provider: "baileys",
      msgId: sentMessage?.key?.id || null,
      messageId: sentMessage?.key?.id || null,
      remoteJid: sentMessage?.key?.remoteJid || remoteJid,
      key: sentMessage?.key || null,
    },
  };
}

async function connectBaileys() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  let version;
  try {
    ({ version } = await fetchLatestBaileysVersion());
  } catch (error) {
    logger.warn({ err: error }, "Failed to fetch latest Baileys version, using package default");
  }

  const nextSocket = makeWASocket({
    auth: state,
    version,
    logger,
    browser: ["Tarkam", "Chrome", "1.0.0"],
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });

  sock = nextSocket;

  nextSocket.ev.on("creds.update", saveCreds);
  nextSocket.ev.on("messages.upsert", handleMessagesUpsert);
  nextSocket.ev.on("group-participants.update", handleGroupParticipantsUpdate);
  nextSocket.ev.on("contacts.upsert", (contacts = []) => {
    for (const contact of contacts) {
      rememberContact(contact?.id, {
        name: contact?.name || null,
        pushName: contact?.notify || null,
        shortName: contact?.short || null,
      });
    }
  });
  nextSocket.ev.on("contacts.update", (contacts = []) => {
    for (const contact of contacts) {
      rememberContact(contact?.id, {
        name: contact?.name || null,
        pushName: contact?.notify || null,
        shortName: contact?.short || null,
      });
    }
  });

  nextSocket.ev.on("connection.update", async (update) => {
    if (update?.qr) {
      currentQr = update.qr;
      try {
        await saveQrToPng(update.qr);
      } catch (error) {
        logger.warn({ err: error }, "Failed to save QR PNG");
      }
      printQrToTerminal(update.qr);
    }

    if (update?.connection) {
      connectionState = update.connection;
    }

    if (update?.connection === "open") {
      currentQr = null;
      lastPrintedQr = null;
      clearSavedQrPng();
      lastDisconnectInfo = null;
      logger.info({ user: nextSocket?.user || null }, "Baileys connection opened");
    }

    if (update?.connection === "close") {
      const statusCode = update?.lastDisconnect?.error?.output?.statusCode;
      lastDisconnectInfo = {
        statusCode: statusCode || null,
        reason: statusCode || DisconnectReason.connectionClosed,
      };

      if (statusCode !== DisconnectReason.loggedOut) {
        logger.warn({ statusCode }, "Baileys connection closed, reconnecting");
        setTimeout(() => {
          connectBaileys().catch((error) => {
            logger.error({ err: error }, "Failed to reconnect Baileys socket");
          });
        }, 1500);
        return;
      }

      logger.warn({ statusCode }, "Baileys logged out, waiting for a fresh login");
    }
  });
}

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "tarkam-baileys-bridge",
    provider: "baileys",
    connection: connectionState,
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "tarkam-baileys-bridge",
    provider: "baileys",
    connection: connectionState,
  });
});

app.get("/api/whatsapp/health", (_req, res) => {
  res.json({
    status: "ok",
    provider: "baileys",
    connection: connectionState,
    webhookTarget: TARKAM_BOT_WEBHOOK_URL,
  });
});

app.get("/api/whatsapp/session", (_req, res) => {
  res.json({
    success: true,
    data: {
      provider: "baileys",
      connection: connectionState,
      qr: currentQr,
      qrAvailable: Boolean(currentQr),
      qrPngAvailable: fs.existsSync(CURRENT_QR_IMAGE_FILE),
      qrPngPath: CURRENT_QR_IMAGE_FILE,
      user: sock?.user || null,
      lastDisconnect: lastDisconnectInfo,
    },
  });
});

app.get("/api/whatsapp/qr.png", (_req, res) => {
  if (!fs.existsSync(CURRENT_QR_IMAGE_FILE)) {
    res.status(404).json({
      success: false,
      error: "QR code PNG is not available.",
      connection: connectionState,
    });
    return;
  }

  res.sendFile(CURRENT_QR_IMAGE_FILE);
});

app.post("/api/whatsapp/send-message", requireApiToken, async (req, res) => {
  try {
    const response = await sendMessageWithProvider(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Failed to send WhatsApp message.",
    });
  }
});

app.put("/api/whatsapp/messages/:messageId", requireApiToken, async (req, res) => {
  try {
    const activeSocket = ensureSocketReady();
    const record = getStoredMessageRecord(req.params.messageId);
    if (!record) {
      res.status(404).json({
        success: false,
        error: "Message metadata not found for edit.",
      });
      return;
    }

    await activeSocket.sendMessage(record.remoteJid, {
      text: String(req.body?.text || ""),
      edit: buildMessageKey(record),
    });

    res.json({
      success: true,
      data: {
        provider: "baileys",
        msgId: record.id,
        remoteJid: record.remoteJid,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Failed to edit WhatsApp message.",
    });
  }
});

app.delete("/api/whatsapp/messages/:messageId", requireApiToken, async (req, res) => {
  try {
    const activeSocket = ensureSocketReady();
    const record = getStoredMessageRecord(req.params.messageId);
    if (!record) {
      res.status(404).json({
        success: false,
        error: "Message metadata not found for delete.",
      });
      return;
    }

    await activeSocket.sendMessage(record.remoteJid, {
      delete: buildMessageKey(record),
    });

    delete sentMessageIndex[record.id];
    saveJsonFile(SENT_MESSAGE_INDEX_FILE, sentMessageIndex);

    res.json({
      success: true,
      data: {
        provider: "baileys",
        msgId: record.id,
        remoteJid: record.remoteJid,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Failed to delete WhatsApp message.",
    });
  }
});

app.post("/api/whatsapp/groups/:groupId/leave", requireApiToken, async (req, res) => {
  try {
    const activeSocket = ensureSocketReady();
    const groupId = String(req.params.groupId || "").trim();
    await activeSocket.groupLeave(groupId);

    res.json({
      success: true,
      data: {
        provider: "baileys",
        groupId,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Failed to leave WhatsApp group.",
    });
  }
});

app.get("/api/whatsapp/contacts/:phone", requireApiToken, async (req, res) => {
  try {
    const activeSocket = ensureSocketReady();
    const jid = normalizePhone(req.params.phone);
    const storedContact = contactIndex[jid] || null;

    let pictureUrl = null;
    try {
      pictureUrl = await activeSocket.profilePictureUrl(jid, "image");
    } catch (_error) {
      pictureUrl = null;
    }

    let onWhatsApp = null;
    try {
      onWhatsApp = await activeSocket.onWhatsApp(jid);
    } catch (_error) {
      onWhatsApp = null;
    }

    res.json({
      success: true,
      provider: "baileys",
      jid,
      phone: plainPhone(jid),
      name: storedContact?.name || storedContact?.pushName || plainPhone(jid),
      pushName: storedContact?.pushName || null,
      shortName: storedContact?.shortName || null,
      imgUrl: pictureUrl,
      exists: Array.isArray(onWhatsApp) ? Boolean(onWhatsApp[0]?.exists) : null,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Failed to fetch contact metadata.",
    });
  }
});

app.get("/api/whatsapp/contacts/:phone/picture", requireApiToken, async (req, res) => {
  try {
    const activeSocket = ensureSocketReady();
    const jid = normalizePhone(req.params.phone);

    let pictureUrl = null;
    try {
      pictureUrl = await activeSocket.profilePictureUrl(jid, "image");
    } catch (_error) {
      pictureUrl = null;
    }

    if (!pictureUrl) {
      res.status(404).json({
        success: false,
        error: "Profile picture not found.",
      });
      return;
    }

    res.json({
      success: true,
      provider: "baileys",
      jid,
      phone: plainPhone(jid),
      imgUrl: pictureUrl,
      url: pictureUrl,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Failed to fetch profile picture.",
    });
  }
});

app.put("/api/whatsapp/contacts", requireApiToken, (req, res) => {
  const phone = String(req.body?.phone || "").trim();
  const name = String(req.body?.name || "").trim();

  if (!phone) {
    res.status(422).json({
      success: false,
      error: "Field 'phone' is required.",
    });
    return;
  }

  rememberContact(phone, {
    name: name || null,
    pushName: name || null,
  });

  res.json({
    success: true,
    provider: "baileys",
    jid: normalizePhone(phone),
    phone: plainPhone(phone),
    name: name || null,
  });
});

app.use((error, req, res, _next) => {
  logger.error(
    {
      err: error,
      method: req.method,
      path: req.originalUrl,
    },
    "Unhandled Baileys bridge error"
  );
  res.status(error?.statusCode || error?.status || 500).json({
    success: false,
    error: error?.message || "Internal server error.",
  });
});

async function bootstrap() {
  await connectBaileys();

  if (
    !TARKAM_BOT_WEBHOOK_URL
    || TARKAM_BOT_WEBHOOK_URL.includes("127.0.0.1")
    || TARKAM_BOT_WEBHOOK_URL.includes("localhost")
  ) {
    logger.warn(
      { webhookTarget: TARKAM_BOT_WEBHOOK_URL },
      "TARKAM_BOT_WEBHOOK_URL looks local or empty; incoming Baileys messages may fail to reach tarkam-bot in Railway"
    );
  }

  app.listen(PORT, HOST, () => {
    logger.info(
      {
        host: HOST,
        port: PORT,
        webhookTarget: TARKAM_BOT_WEBHOOK_URL,
      },
      "Tarkam Baileys bridge started"
    );
  });
}

bootstrap().catch((error) => {
  logger.error({ err: error }, "Failed to start Tarkam Baileys bridge");
  process.exitCode = 1;
});
