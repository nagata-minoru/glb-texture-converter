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
register('./loader.mjs', pathToFileURL('./'));
