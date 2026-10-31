/**
 * crypto.utils.js
 * Client-side WebCrypto encryption utility for Credentials Vault.
 * Uses AES-GCM (256-bit) with PBKDF2 key derivation (SHA-256, 100,000 iterations).
 */
(function (window) {
  'use strict';
  const app = window.AdmissionApp = window.AdmissionApp || {};

  const VAULT_CONFIG_KEY = "bd_admission_vault_config_v1";
  const VAULT_WARNED_KEY = "bd_admission_vault_warned_v1";
  const PREFIX_ENC = "enc:v1:";
  const TEST_PAYLOAD = "VAULT_VERIFY_SUCCESS_2026";

  let memoryPassphrase = null;

  function getCrypto() {
    if (typeof window !== "undefined" && window.crypto) return window.crypto;
    if (typeof globalThis !== "undefined" && globalThis.crypto) return globalThis.crypto;
    throw new Error("WebCrypto API is not supported in this environment");
  }

  function bytesToBase64(bytes) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  async function deriveKey(passphrase, salt) {
    const enc = new TextEncoder();
    const c = getCrypto();
    const keyMaterial = await c.subtle.importKey(
      "raw",
      enc.encode(passphrase),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return c.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptString(plainText, passphrase) {
    if (!plainText) return "";
    const enc = new TextEncoder();
    const c = getCrypto();
    const salt = c.getRandomValues(new Uint8Array(16));
    const iv = c.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt);

    const cipherBuffer = await c.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      enc.encode(plainText)
    );

    const combined = new Uint8Array(salt.byteLength + iv.byteLength + cipherBuffer.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.byteLength);
    combined.set(new Uint8Array(cipherBuffer), salt.byteLength + iv.byteLength);

    return PREFIX_ENC + bytesToBase64(combined);
  }

  async function decryptString(encString, passphrase) {
    if (!encString || !encString.startsWith(PREFIX_ENC)) {
      return encString || "";
    }
    const b64 = encString.slice(PREFIX_ENC.length);
    const bytes = base64ToBytes(b64);
    if (bytes.length < 28) {
      throw new Error("Invalid ciphertext length");
    }
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const data = bytes.slice(28);

    const key = await deriveKey(passphrase, salt);
    const c = getCrypto();
    const decryptedBuffer = await c.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );
    return new TextDecoder().decode(decryptedBuffer);
  }

  function getVaultConfig() {
    try {
      if (typeof localStorage === "undefined") return null;
      const raw = localStorage.getItem(VAULT_CONFIG_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function isVaultConfigured() {
    const config = getVaultConfig();
    return Boolean(config && config.enabled && config.verifier);
  }

  function isVaultUnlocked() {
    if (!isVaultConfigured()) return true;
    return Boolean(memoryPassphrase);
  }

  function getActivePassphrase() {
    return memoryPassphrase;
  }

  async function setupVaultPassphrase(passphrase) {
    if (!passphrase || passphrase.trim().length < 4) {
      throw new Error("Passphrase must be at least 4 characters.");
    }
    const verifier = await encryptString(TEST_PAYLOAD, passphrase);
    const config = {
      enabled: true,
      createdAt: new Date().toISOString(),
      verifier: verifier
    };
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(VAULT_CONFIG_KEY, JSON.stringify(config));
    }
    memoryPassphrase = passphrase;
    return true;
  }

  async function unlockVault(passphrase) {
    const config = getVaultConfig();
    if (!config || !config.verifier) {
      memoryPassphrase = passphrase;
      return true;
    }
    try {
      const result = await decryptString(config.verifier, passphrase);
      if (result === TEST_PAYLOAD) {
        memoryPassphrase = passphrase;
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function lockVault() {
    memoryPassphrase = null;
  }

  function removeVaultPassphrase() {
    memoryPassphrase = null;
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(VAULT_CONFIG_KEY);
    }
  }

  function hasSeenVaultWarning() {
    try {
      if (typeof localStorage === "undefined") return false;
      return localStorage.getItem(VAULT_WARNED_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  function markVaultWarningSeen() {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(VAULT_WARNED_KEY, "true");
      }
    } catch (e) {}
  }

  app.VaultCrypto = {
    PREFIX_ENC,
    encryptString,
    decryptString,
    isVaultConfigured,
    isVaultUnlocked,
    getActivePassphrase,
    setupVaultPassphrase,
    unlockVault,
    lockVault,
    removeVaultPassphrase,
    hasSeenVaultWarning,
    markVaultWarningSeen
  };

  window.VaultCrypto = app.VaultCrypto;
})(window);
