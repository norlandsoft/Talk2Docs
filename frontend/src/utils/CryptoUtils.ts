import crypto from 'crypto-js';
import sha256 from 'crypto-js/sha256';
import md5 from 'crypto-js/md5';

const SHA = (content: string | crypto.lib.WordArray) => {
  return sha256(content).toString();
}

const MD5 = (content: string | crypto.lib.WordArray) => {
  return md5(content);
}

const AES = (content: string | crypto.lib.WordArray, key: string) => {
  return crypto.AES.encrypt(content, crypto.enc.Utf8.parse(key), {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7
  }).toString()
}

// 字符串转Base64
const WordToBase64 = (content: crypto.lib.WordArray) => {
  return crypto.enc.Base64.stringify(content);
}

const StringToBase64 = (content: string) => {
  return crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(content));
}

// Base64转字符串
const Base64ToString = (content: string) => {
  return crypto.enc.Base64.parse(content).toString(crypto.enc.Utf8);
}

export {SHA, MD5, AES, StringToBase64, Base64ToString};