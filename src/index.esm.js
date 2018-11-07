import ReeValidate from './ReeValidate'
import en from '../locale/en'
import * as Rules from './rules'
import mapFields from './core/mapFields'
import Validator from './core/Validator'
import ErrorBag from './core/ErrorBag'
import { assign } from './utils'

const version = '__VERSION__'

const rulesPlugin = ({ Validator }) => {
  Object.keys(Rules).forEach(rule => {
    Validator.extend(rule, Rules[rule].validate, assign({}, Rules[rule].options, { paramNames: Rules[rule].paramNames }))
  })

  // Merge the english messages.
  Validator.localize('en', en)
}

ReeValidate.use(rulesPlugin)

export {
  mapFields,
  Validator,
  ErrorBag,
  Rules,
  version,
}

export default ReeValidate
