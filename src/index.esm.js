import ReeValidate from './ReeValidate'
import en from '../locale/en'
import * as Rules from './rules'
import mapFields from './core/mapFields'
import Validator from './core/Validator'
import ErrorBag from './core/ErrorBag'
import { assign } from './utils'

const version = '__VERSION__'

Object.keys(Rules).forEach(rule => {
  ReeValidate.Validator.extend(rule, Rules[rule].validate, assign({}, Rules[rule].options, { paramNames: Rules[rule].paramNames }))
})

// Merge the english messages.
ReeValidate.Validator.localize('en', en)

export {
  mapFields,
  Validator,
  ErrorBag,
  Rules,
  version,
}

ReeValidate.version = version
ReeValidate.mapFields = mapFields

export default ReeValidate
