ree-validate is a plugin for [React.js](https://facebook.github.io/react/) that allows you to validate input fields, and display errors.

This is an extended version of VeeValidate [VeeValidate](http://vee-validate.logaretm.com/)

This plugin is inspired by [PHP Framework Laravel's validation](https://laravel.com/).

### Installation

#### npm

```
npm install ree-validate --save
```

#### yarn
```
yarn add ree-validate
```

### Getting Started
```
import ReeValidate from 'ree-validate'
```

install classnames for easily manage the classes
```
npm i -S classnames

import classnames from 'classnames'

```

Now create a new class and bind errors bag with state.

```
class Page extends Component {
  constructor(props) {
    super(props)
    
    this.validator = new ReeValidate.Validator({
      email: 'required|email',
      password: 'required|min:3',
    })
    
    this.state = {
      formData: {
        email: '',
        password: '',
      },
      errors: this.validator.errors,
    }
    
    this.onChange = this.onChange.bind(this)
    this.validateAndSubmit = this.validateAndSubmit.bind(this)
  }
  
  onChange(e) {
    const name = e.target.name
    const value = e.target.value
    const { errors } = this.validator
    
    // reset errors for url field
    errors.remove(name)
    
    // update form data
    this.setState({ formData: { ...this.state.formData, [name]: value } })
    
    this.validator.validate(name, value)
      .then(() => {
        this.setState({ errors })
      })
  }
  
  submit(formData) {
    console.log(formData)
  }
  
  async validateAndSubmit(e) {
    e.preventDefault()
    
    const { formData } = this.state
    const { errors } = this.validator

    const valid = this.validator.validateAll(formData)
    
    if (valid) {
        this.submit(formData)
    } else {
        this.setState({ errors })        
    }    
  }
  
  render() {
    const { errors } = this.state
    
    return (<form id="sign_in" onSubmit={this.validateAndSubmit}>
      <div className="msg">Sign in to start your session</div>
      <div className="input-group">
                <span className="input-group-addon">
                    <i className="material-icons">person</i>
                </span>
        <div className={classnames('form-line', { 'error':  errors.has('email')})}>
          <input type="email"
                 id="email"
                 className="form-control"
                 name="email"
                 placeholder="Email"
                 required
                 onChange={this.onChange}
                 autoFocus/>
        </div>
        { errors.has('email') &&
        <label id="name-error" className="error" htmlFor="email">{ errors.first('email') }</label>
        }
      </div>
      <div className="input-group">
                <span className="input-group-addon">
                    <i className="material-icons">lock</i>
                </span>
        <div className={classnames('form-line', { 'error':  errors.has('password')})}>
          <input type="password"
                 id="password"
                 className="form-control"
                 name="password"
                 placeholder="Password"
                 required
                 onChange={this.onChange}/>
        </div>
        { errors.has('password') &&
        <label id="name-error" className="error" htmlFor="password">{ errors.first('password') }</label>
        }
      </div>
      <div className="row">
        <div className="col-xs-8 p-t-5">
          <input type="checkbox" name="rememberme" id="rememberme" className="filled-in chk-col-pink"/>
          <label htmlFor="rememberme">Remember Me</label>
        </div>
        <div className="col-xs-4">
          <button className="btn btn-block bg-pink waves-effect" type="submit">SIGN IN</button>
        </div>
      </div>
      <div className="row m-t-15 m-b--20">
        <div className="col-xs-6">
          <a href="sign-up.html">Register Now!</a>
        </div>
        <div className="col-xs-6 align-right">
          <a href="forgot-password.html">Forgot Password?</a>
        </div>
      </div>
    </form>)
  }
}

export default Page

```

### Changing the locale for ReeValidate

```
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReeValidate from 'ree-validate'
import fr from 'ree-validate/dist/locale/fr'
```

```
class Page extends Component {
    static displayName = 'RegisterPage'
    static propTypes = {
        // validate props
    }

    constructor(props) {
        super(props)

        this.validator = new ReeValidate.Validator({
            email: 'required|email',
            password: 'required|min:6'
        })

        this.validator.localize('fr', fr)
    }

   render() {
        // render component
    }
}

export default Page
```

### HOC

You can also use the following hoc

note: it is not yet part of the package

```jsx harmony
import * as React from 'react'
import { Validator } from 'ree-validate'

export default function withValidator(Component, fields){
  class withValidator extends React.Component{

    validator = new Validator()

    _isMounted = false

    constructor(props: any) {
      super(props)

      this.attachRules(fields)

      this.state = {
        errors: this.validator.errors,
      }
    }

    componentDidMount() {
      this._isMounted = true
    }

    componentWillUnmount() {
      this._isMounted = false
    }

    validateAll = async (data: any) => {
      const { errors } = this.validator

      for (let fieldName in data) {
        if (data.hasOwnProperty(fieldName)) {
          if (errors.has(fieldName)) {
            errors.remove(fieldName)
          }
        }
      }

      const isValid = await this.validator.validateAll(data)

      if (this._isMounted) {
        this.setState({ errors })
      }

      return isValid
    }
    validateOne = async ({ name, value }: { name: string, value: any }) => {
      const { errors } = this.validator

      if (errors.has(name)) {
        errors.remove(name)
      }

      const isValid = await this.validator.validate(name, value)

      if (this._isMounted) {
        this.setState({ errors })
      }

      return isValid
    }

    validate = (data: any, multi: boolean = true) => {
      if (multi) {
        return this.validateAll(data)
      }
      return this.validateOne(data)
    }

    clearErrors = (fieldName: ?string) => {
      const { errors } = this.validator

      if (fieldName) {
        errors.remove(fieldName)
      } else {
        errors.clear()
      }

      if (this._isMounted) {
        this.setState({ errors })
      }
    }

    attachRules = (field: Field | Array<Field>) => {
      if (isArray(field)) {
        field.forEach((f: Field) => {
          this.attachRules(f)
        })
      } else {
        this.detachRules(field)

        this.validator.attach(field)
      }
    }

    detachRules = (field: Field | Array<Field>) => {
      if (isArray(field)) {
        field.forEach((f: Field) => {
          this.detachRules(f)
        })
      } else {
        if (this.validator.fields.find({ name: field.name })) {
          this.validator.detach(field.name)
        }
      }
    }

    addErrors = (field: string, message: any) => {
      const { errors } = this.validator

      if (errors.has(field)) {
        errors.remove(field)
      }

      errors.add(field, message)

      if (this._isMounted) {
        this.setState({ errors })
      }
    }

    render() {
      return <Component {...this.props}
                        validator={this.validator}
                        validate={this.validate}
                        attachRules={this.attachRules}
                        detachRules={this.detachRules}
                        errors={this.state.errors}
                        addErrors={this.addErrors}
                        clearErrors={this.clearErrors}/>
    }
  }

  withValidator.displayName = `withValidator_${Component.displayName || Component.name}`

  return withValidator
}

```

then use this hoc as following

```jsx harmony
class Page extends React.Component<*, State> {
  static displayName = 'Login Page'

  state = {
    form: {
      username: null,
      password: null,
    },
  }

  handleChange = async (name: string, value: any) => {
    const isValid = await this.props.validateOne(name, value)
    
    console.log(this.props.errors)
  }

  handleSubmit = async (evt) => {
    evt.preventDefault()

    const isValid = await this.props.validateAll(this.state.form)

    console.log(this.props.errors)
  }

  render() {
    console.log(this.props)
  }
}

export default withValidator(Page, [
  {
    name: 'username',
    rules: 'required',
    alias: 'Username',
  },
  {
    name: 'password',
    rules: 'required',
    alias: 'Password',
  },
])
```

### Available Validation Rules

[Available Validation Rules](http://vee-validate.logaretm.com/index.html#available-rules)

    after
    alpha
    alpha_dash
    alpha_num
    alpha_spaces
    before
    between
    confirmed
    credit_card
    date_between
    date_format
    decimal
    digits
    dimensions
    email
    ext
    image
    in
    ip
    max
    max_value
    mimes
    min
    min_value
    not_in
    numeric
    regex
    required
    size
    url

### Compatability

This library uses ES6 Promises so be sure to provide a polyfill for it for the browsers that does not support it.

### Credits
- Some validations/test scenarios are provided/based on [validator.js](https://github.com/chriso/validator.js).
- Inspired by Laravel's [validation syntax](https://laravel.com/docs/5.4/validation).
- Originally written by [Abdelrahman Ismail](https://github.com/Abdelrahman3D)

### license MIT
