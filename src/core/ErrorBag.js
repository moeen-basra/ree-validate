import { find, isCallable, isNullOrUndefined, parseSelector, values } from '../utils'

export default class ErrorBag {
  items: FieldError[]

  constructor(errorBag?: ErrorBag) {
    // make this bag a mirror of the provided one, sharing the same items reference.
    if (errorBag && errorBag instanceof ErrorBag) {
      this.items = errorBag.items
    } else {
      this.items = []
    }
  }

  [typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']() {
    let index = 0
    return {
      next: () => {
        return { value: this.items[index++], done: index > this.items.length }
      }
    }
  }

  /**
   * Adds an error to the internal array.
   */
  add(error: FieldError | FieldError[]): void {
    this.items.push(...this._normalizeError(error))
  }

  /**
   * Normalizes passed errors to an error array.
   */
  _normalizeError(error: FieldError | FieldError[]): FieldError[] {
    if (Array.isArray(error)) {
      return error.map(e => {
        e.scope = !isNullOrUndefined(e.scope) ? e.scope : null

        return e
      })
    }

    error.scope = !isNullOrUndefined(error.scope) ? error.scope : null

    return [error]
  }

  /**
   * Regenrates error messages if they have a generator function.
   */
  regenerate(): void {
    this.items.forEach(i => {
      i.msg = isCallable(i.regenerate) ? i.regenerate() : i.msg
    })
  }

  /**
   * Updates a field error with the new field scope.
   */
  update(id: string, error: FieldError): void {
    const item = find(this.items, i => i.id === id)
    if (!item) {
      return
    }

    const idx = this.items.indexOf(item)
    this.items.splice(idx, 1)
    item.scope = error.scope
    this.items.push(item)
  }

  /**
   * Gets all error messages from the internal array.
   */
  all(scope: ?string): Array<string> {
    const filterFn = item => {
      let matchesScope = true
      if (!isNullOrUndefined(scope)) {
        matchesScope = item.scope === scope
      }
      return matchesScope
    }
    return this.items.filter(filterFn).map(e => e.msg)
  }

  /**
   * Checks if there are any errors in the internal array.
   */
  any(scope: ?string): boolean {
    const filterFn = item => {
      let matchesScope = true
      if (!isNullOrUndefined(scope)) {
        matchesScope = item.scope === scope
      }
      return matchesScope
    }

    return !!this.items.filter(filterFn).length
  }

  /**
   * Removes all items from the internal array.
   */
  clear(scope?: ?string): void {
    if (isNullOrUndefined(scope)) {
      scope = null
    }

    for (let i = 0; i < this.items.length; ++i) {
      if (this.items[i].scope === scope) {
        this.items.splice(i, 1)
        --i
      }
    }
  }

  /**
   * Collects errors into groups or for a specific field.
   */
  collect(field?: string, scope?: string | null, map = true): Array {
    const isSingleField = !isNullOrUndefined(field) && !field.includes('*')
    const groupErrors = items => {
      const errors = items.reduce((collection, error) => {
        if (!collection[error.field]) {
          collection[error.field] = []
        }

        collection[error.field].push(map ? error.msg : error)

        return collection
      }, {})

      // reduce the collection to be a single array.
      if (isSingleField) {
        return values(errors)[0] || []
      }

      return errors
    }

    if (isNullOrUndefined(field)) {
      return groupErrors(this.items)
    }

    const selector = isNullOrUndefined(scope) ? String(field) : `${scope}.${field}`
    const { isPrimary, isAlt } = this._makeCandidateFilters(selector)

    let collected = this.items.reduce(
      (prev, curr) => {
        if (isPrimary(curr)) {
          prev.primary.push(curr)
        }

        if (isAlt(curr)) {
          prev.alt.push(curr)
        }

        return prev
      },
      { primary: [], alt: [] }
    )

    collected = collected.primary.length ? collected.primary : collected.alt

    return groupErrors(collected)
  }

  /**
   * Gets the internal array length.
   */
  count(): number {
    return this.items.length
  }

  /**
   * Finds and fetches the first error message for the specified field id.
   */
  firstById(id: string): string | null {
    const error = find(this.items, i => i.id === id)

    return error ? error.msg : undefined
  }

  /**
   * Gets the first error message for a specific field.
   */
  first(field: string, scope?: string): ?string {
    const selector = isNullOrUndefined(scope) ? field : `${scope}.${field}`
    const match = this._match(selector)

    return match && match.msg
  }

  /**
   * Returns the first error rule for the specified field
   */
  firstRule(field: string, scope?: string): ?string {
    const errors = this.collect(field, scope, false)

    return (errors.length && errors[0].rule) || undefined
  }

  /**
   * Checks if the internal array has at least one error for the specified field.
   */
  has(field: string, scope?: string): boolean {
    return !!this.first(field, scope)
  }

  /**
   * Gets the first error message for a specific field and a rule.
   */
  firstByRule(name: string, rule: string, scope?: string): ?string {
    const error = this.collect(name, scope, false).filter(e => e.rule === rule)[0]

    return (error && error.msg) || undefined
  }

  /**
   * Gets the first error message for a specific field that not match the rule.
   */
  firstNot(name: string, rule = 'required', scope?: string): ?string {
    const error = this.collect(name, scope, false).filter(e => e.rule !== rule)[0]

    return (error && error.msg) || undefined
  }

  /**
   * Removes errors by matching against the id or ids.
   */
  removeById(id: string | string[]): ?string {
    let condition = item => item.id === id
    if (Array.isArray(id)) {
      condition = item => id.indexOf(item.id) !== -1
    }

    for (let i = 0; i < this.items.length; ++i) {
      if (condition(this.items[i])) {
        this.items.splice(i, 1)
        --i
      }
    }
  }

  /**
   * Removes all error messages associated with a specific field.
   */
  remove(field: string, scope: ?string): void {
    if (isNullOrUndefined(field)) {
      return
    }

    const selector = isNullOrUndefined(scope) ? String(field) : `${scope}.${field}`
    const { isPrimary, isAlt } = this._makeCandidateFilters(selector)
    const matches = item => isPrimary(item) || isAlt(item)
    const shouldRemove = item => {
      return matches(item)
    }

    for (let i = 0; i < this.items.length; ++i) {
      if (shouldRemove(this.items[i])) {
        this.items.splice(i, 1)
        --i
      }
    }
  }

  _makeCandidateFilters(selector: any): any {
    let matchesRule = () => true
    let matchesScope = () => true
    let matchesName = () => true

    const { id, rule, scope, name } = parseSelector(selector)

    if (rule) {
      matchesRule = item => item.rule === rule
    }

    // match by id, can be combined with rule selection.
    if (id) {
      return {
        isPrimary: item => matchesRule(item) && (item => id === item.id),
        isAlt: () => false
      }
    }

    if (isNullOrUndefined(scope)) {
      // if no scope specified, make sure the found error has no scope.
      matchesScope = item => isNullOrUndefined(item.scope)
    } else {
      matchesScope = item => item.scope === scope
    }

    if (!isNullOrUndefined(name) && name !== '*') {
      matchesName = item => item.field === name
    }

    // matches the first candidate.
    const isPrimary = item => {
      return matchesName(item) && matchesRule(item) && matchesScope(item)
    }

    // matches a second candidate, which is a field with a name containing the '.' character.
    const isAlt = item => {
      return matchesRule(item) && item.field === `${scope}.${name}`
    }

    return {
      isPrimary,
      isAlt
    }
  }

  _match(selector: string): boolean {
    if (isNullOrUndefined(selector)) {
      return undefined
    }

    const { isPrimary, isAlt } = this._makeCandidateFilters(selector)

    return this.items.reduce((prev, item, idx, arr) => {
      const isLast = idx === arr.length - 1
      if (prev.primary) {
        return isLast ? prev.primary : prev
      }

      if (isPrimary(item)) {
        prev.primary = item
      }

      if (isAlt(item)) {
        prev.alt = item
      }

      // keep going.
      if (!isLast) {
        return prev
      }

      return prev.primary || prev.alt
    }, {})
  }
}
