import ReeValidate from './ReeValidate'
import Validator from './core/validator'
import ErrorBag from './core/errorBag'
import mapFields from './core/mapFields'
import { ValidationProvider } from './components'

const version = '__VERSION__'
const install = ReeValidate.install
const use = ReeValidate.use

export {
  install,
  use,
  mapFields,
  Validator,
  ErrorBag,
  version,
  ValidationProvider
}

export default ReeValidate
