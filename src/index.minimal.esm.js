import ReeValidate from './ReeValidate'
import Validator from './core/Validator'
import ErrorBag from './core/ErrorBag'
import mapFields from './core/mapFields'

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
}

export default ReeValidate
