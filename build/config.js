import path from 'path'
import { version } from '../package.json'

export default {
  banner:
  `/**
  * ree-validate v${version}
  * (c) ${new Date().getFullYear()} Moeen Basra
  * @license MIT
  */`,
  outputFolder: path.join(__dirname, '..', 'dist'),
  uglifyOptions: {
    compress: true,
    mangle: true,
  },
}
