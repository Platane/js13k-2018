import babel from 'rollup-plugin-babel'
import string from 'rollup-plugin-string'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  plugins: [
    //
    string({
      include: '**/*.glsl',
    }),
    resolve(),
    babel(),
  ],
}
