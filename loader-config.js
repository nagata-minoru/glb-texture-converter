/**
 * このファイルは、Node.jsのカスタムローダー設定のためのものです。
 * カスタムローダー（loader.mjs）を登録し、HTTPSからのモジュールインポートを可能にします。
 *
 * 使用方法: node --require ./loader-config.js your-main-script.js
 *
 * @fileoverview カスタムESMローダーの設定
 * @module loader-config
 */

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const loaderPath = resolve(__dirname, './loader.mjs');
register(loaderPath, pathToFileURL('./'));
