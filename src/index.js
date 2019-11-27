import * as Rules from './rules'
import ReeValidate from './ReeValidate'
import mapFields from './core/mapFields'
import { assign } from './utils'
import en from '../locale/en'

Object.keys(Rules).forEach(rule => {
  ReeValidate.Validator.extend(rule, Rules[rule].validate, assign({}, Rules[rule].options, { paramNames: Rules[rule].paramNames }))
})

ReeValidate.Validator.localize({
  en,
})

ReeValidate.version = '__VERSION__'
ReeValidate.Rules = Rules
ReeValidate.mapFields = mapFields

export default ReeValidate
