import en from '../locale/en'
import use from './use'
import Rules from './rules'
import mapFields from './core/mapFields'
import Validator from './core/validator'
import ErrorBag from './core/errorBag'

const version = '__VERSION__'

const rulesPlugin = ({ Validator }) => {
  Object.keys(Rules).forEach(rule => {
    Validator.extend(rule, Rules[rule])
  })

  // Merge the english messages.
  Validator.localize('en', en)
}

use(rulesPlugin)

export {
  use,
  mapFields,
  Validator,
  ErrorBag,
  Rules,
  version,
}

export default {
  use,
  mapFields,
  Validator,
  ErrorBag,
  Rules,
  version,
}
