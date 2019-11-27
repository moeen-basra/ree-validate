// @flow
import RuleContainer from './RuleContainer'
import { addEventListener, normalizeEvents } from '../utils/events'
import {
  assign,
  createFlags,
  isCallable,
  isCheckboxOrRadioInput,
  isNullOrUndefined,
  isObject,
  isTextInput,
  makeDelayObject,
  merge,
  normalizeRules,
  toggleClass,
  uniqId,
  warn,
} from '../utils'

const DEFAULT_OPTIONS = {
  targetOf: null,
  immediate: false,
  scope: null,
  listen: true,
  name: null,
  rules: {},
  classes: false,
  validity: true,
  events: 'change|blur',
  delay: 0,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty', // control has been interacted with
  },
}

export default class Field {
  id: string
  updated: boolean
  dependencies: Array<{ name: string, field: Field }>
  events: string[]
  rules: { [string]: Object }
  validity: boolean
  flags: { [string]: boolean }
  alias: ?string
  getter: () => any
  name: string
  scope: string | null
  targetOf: ?string
  immediate: boolean
  classes: boolean
  classNames: { [string]: string }
  delay: number | Object
  listen: boolean
  value: any
  _alias: ?string
  _delay: number | Object

  constructor (options: FieldOptions | MapObject = {}) {
    this.id = uniqId()
    this.updated = false
    this.dependencies = []
    this.events = []
    this.delay = 0
    this.rules = {}
    this.forceRequired = false
    this.classNames = assign({}, DEFAULT_OPTIONS.classNames)
    options = assign({}, DEFAULT_OPTIONS, options)
    this._delay = !isNullOrUndefined(options.delay) ? options.delay : 0 // cache initial delay
    this.validity = options.validity
    this.flags = createFlags()
    this.update(options)
    // set initial value.
    this.initialValue = this.value
    this.updated = false
  }

  get validator (): any {
    return {
      validate: () => {
      },
    }
  }

  get isRequired (): boolean {
    return !!this.rules.required
  }

  get isDisabled (): boolean {
    return false
  }

  /**
   * Gets the display name (user-friendly name).
   */
  get alias (): ?string {
    return this._alias
  }

  /**
   * Gets the input value.
   */

  get value (): any {
    if (!isCallable(this.getter)) {
      return undefined
    }

    return this.getter()
  }

  get bails () {
    return this._bails
  }

  /**
   * If the field rejects false as a valid value for the required rule.
   */

  get rejectsFalse (): boolean {
    return false
  }

  /**
   * Determines if the instance matches the options provided.
   */
  matches (options: FieldMatchOptions | null): boolean {
    if (!options) {
      return true
    }

    if (options.id) {
      return this.id === options.id
    }

    if (options.name === undefined && options.scope === undefined) {
      return true
    }

    if (options.scope === undefined) {
      return this.name === options.name
    }

    if (options.name === undefined) {
      return this.scope === options.scope
    }

    return options.name === this.name && options.scope === this.scope
  }

  /**
   * Keeps a reference of the most current validation run.
   */
  waitFor (pendingPromise) {
    this._waitingFor = pendingPromise
  }

  isWaitingFor (promise) {
    return this._waitingFor === promise
  }

  /**
   * Updates the field with changed data.
   */
  update (options: Object) {
    this.targetOf = options.targetOf || null
    this.immediate = options.immediate || this.immediate || false
    this.persist = options.persist || this.persist || false

    // update errors scope if the field scope was changed.
    if (!isNullOrUndefined(options.scope) && options.scope !== this.scope && isCallable(this.validator.update)) {
      this.validator.update(this.id, { scope: options.scope })
    }
    this.scope = !isNullOrUndefined(options.scope) ? options.scope
      : !isNullOrUndefined(this.scope) ? this.scope : null
    this.name = (!isNullOrUndefined(options.name) ? String(options.name) : options.name) || this.name || null
    this.rules = options.rules !== undefined ? normalizeRules(options.rules) : this.rules
    this._bails = options.bails !== undefined ? options.bails : this._bails
    this.listen = options.listen !== undefined ? options.listen : this.listen
    this.classes = (options.classes || this.classes || false) && !this.componentInstance
    this.classNames = isObject(options.classNames) ? merge(this.classNames, options.classNames) : this.classNames
    this.getter = isCallable(options.getter) ? options.getter : this.getter
    this._alias = options.alias || this._alias
    this.events = (options.events) ? normalizeEvents(options.events) : this.events
    this.delay = makeDelayObject(this.events, options.delay || this.delay, this._delay)
    this.updateDependencies()
    this.addActionListeners()

    if (process.env.NODE_ENV !== 'production' && !this.name && !this.targetOf) {
      warn('A field is missing a "name"')
    }

    // update required flag flags
    if (options.rules !== undefined) {
      this.flags.required = this.isRequired
    }

    // validate if it was validated before and field was updated and there was a rules mutation.
    if (this.flags.validated && options.rules !== undefined && this.updated) {
      this.validator.validate(`#${this.id}`)
    }

    this.updated = true

    // no need to continue.
    this.updateClasses()
  }

  /**
   * Resets field flags and errors.
   */
  reset () {
    if (this._cancellationToken) {
      this._cancellationToken.cancelled = true
      delete this._cancellationToken
    }

    const defaults = createFlags()
    Object.keys(this.flags).filter(flag => flag !== 'required').forEach(flag => {
      this.flags[flag] = defaults[flag]
    })

    this.addActionListeners()
    this.updateClasses()
  }

  /**
   * Sets the flags and their negated counterparts, and updates the classes and re-adds action listeners.
   */
  setFlags (flags: { [string]: boolean }) {
    const negated = {
      pristine: 'dirty',
      dirty: 'pristine',
      valid: 'invalid',
      invalid: 'valid',
      touched: 'untouched',
      untouched: 'touched',
    }

    Object.keys(flags).forEach(flag => {
      this.flags[flag] = flags[flag]
      // if it has a negation and was not specified, set it as well.
      if (negated[flag] && flags[negated[flag]] === undefined) {
        this.flags[negated[flag]] = !flags[flag]
      }
    })

    if (
      flags.untouched !== undefined ||
      flags.touched !== undefined ||
      flags.dirty !== undefined ||
      flags.pristine !== undefined
    ) {
      this.addActionListeners()
    }
    this.updateClasses()
  }

  /**
   * Determines if the field requires references to target fields.
   */
  updateDependencies () {
    // reset dependencies.
    this.dependencies.forEach(d => d.field.destroy())
    this.dependencies = []

    // we get the selectors for each field.
    const fields = Object.keys(this.rules).reduce((prev, r) => {
      if (RuleContainer.isTargetRule(r)) {
        prev.push({ selector: this.rules[r][0], name: r })
      }

      return prev
    }, [])

    if (!fields.length) return

    fields.forEach(({ selector, name }) => {
      const options: FieldOptions = {
        classes: this.classes,
        classNames: this.classNames,
        delay: this.delay,
        scope: this.scope,
        events: this.events.join('|'),
        immediate: this.immediate,
        targetOf: this.id,
      }

      this.dependencies.push({ name, field: new Field(options) })
    })
  }

  /**
   * Updates the element classes depending on each field flag status.
   */
  updateClasses () {
    if (!this.classes || this.isDisabled) return
    const applyClasses = (el) => {
      toggleClass(el, this.classNames.dirty, this.flags.dirty)
      toggleClass(el, this.classNames.pristine, this.flags.pristine)
      toggleClass(el, this.classNames.touched, this.flags.touched)
      toggleClass(el, this.classNames.untouched, this.flags.untouched)
      // make sure we don't set any classes if the state is undetermined.
      if (!isNullOrUndefined(this.flags.valid) && this.flags.validated) {
        toggleClass(el, this.classNames.valid, this.flags.valid)
      }

      if (!isNullOrUndefined(this.flags.invalid) && this.flags.validated) {
        toggleClass(el, this.classNames.invalid, this.flags.invalid)
      }
    }

    if (!isCheckboxOrRadioInput(this.el)) {
      applyClasses(this.el)
    }
  }

  /**
   * Adds the listeners required for automatic classes and some flags.
   */
  addActionListeners () {
    if (!this.el) return

    const onBlur = () => {
      this.flags.touched = true
      this.flags.untouched = false
      if (this.classes) {
        toggleClass(this.el, this.classNames.touched, true)
        toggleClass(this.el, this.classNames.untouched, false)
      }
    }

    // const inputEvent = isTextInput(this.el) ? 'input' : 'change'
    const inputEvent = 'change'
    const onInput = () => {
      this.flags.dirty = true
      this.flags.pristine = false
      if (this.classes) {
        toggleClass(this.el, this.classNames.pristine, false)
        toggleClass(this.el, this.classNames.dirty, true)
      }
    }

    if (!this.el) return

    addEventListener(this.el, inputEvent, onInput)
    // Checkboxes and radio buttons on Mac don't emit blur naturally, so we listen on click instead.
    const blurEvent = isCheckboxOrRadioInput(this.el) ? 'change' : 'blur'
    addEventListener(this.el, blurEvent, onBlur)
  }

  checkValueChanged () {
    // handle some people initialize the value to null, since text inputs have empty string value.
    if (this.initialValue === null && this.value === '' && isTextInput(this.el)) {
      return false
    }

    return this.value !== this.initialValue
  }

  /**
   * Determines the suitable primary event to listen for.
   */
  _determineInputEvent () {
    return 'change'
  }

  /**
   * Determines the list of events to listen to.
   */
  _determineEventList (defaultInputEvent) {
    // if no event is configured, or it is a component or a text input then respect the user choice.
    if (!this.events.length) {
      return [...this.events].map(evt => {
        if (evt === 'input') {
          return 'change'
        }

        return evt
      })
    }

    // force suitable event for non-text type fields.
    return this.events.map(e => {
      if (e === 'input') {
        return defaultInputEvent
      }

      return e
    })
  }

  /**
   * Removes all listeners.
   */
  destroy () {
    // ignore the result of any ongoing validation.
    if (this._cancellationToken) {
      this._cancellationToken.cancelled = true
    }

    this.dependencies.forEach(d => d.field.destroy())
    this.dependencies = []
  }
}
