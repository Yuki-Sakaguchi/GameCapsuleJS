import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/game-capsule.js',
      format: 'umd',
      extend: true,
      name: "GameCapsule",
    },
    plugins: [
      typescript(),
      commonjs()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/game-capsule.min.js',
      format: 'umd',
      extend: true,
      name: "GameCapsule",
    },
    plugins: [
      typescript(),
      commonjs(),
      uglify()
    ]
  }
]
