import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

const plugins = [
  typescript(), // TypeScriptのコンパイル.
  commonjs(),   // CommonJSを解決.
]

if (process.env.NODE_ENV !== 'production') {
  // 開発時のみ使うプラグイン
} else {
  // 公開用のみ使うプラグイン
  plugins.push(uglify()) // ミニファイ
}

export default {
  input: './src/index.ts',
  output: {
    file: './lib/game-capsule.js',
    format: 'umd',
    extend: true,
    name: "GameCapsule",
  },
  plugins: plugins
}
