<p align="center">
  <a href="https://github.com/moeen-basra/ree-validate.git" target="_blank">
    <img width="200" src="http://www.unixstickers.com/image/data/stickers/react/badge/React-JS.sh.png">
  </a>
</p>

<br>

ree-validate is a plugin for [React.js](https://facebook.github.io/react/) that allows you to validate input fields, and display errors.

This is an extended version of VeeValidate [VeeValidate](http://vee-validate.logaretm.com/)

This plugin is inspired by [PHP Framework Laravel's validation](https://laravel.com/).

### Installation

#### npm

```
npm install ree-validate --save
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
    
    this.validator = new ReeValidate({
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
  
  validateAndSubmit(e) {
    e.preventDefault()
    
    const { formData } = this.state
    const { errors } = this.validator

    this.validator.validateAll(formData)
      .then(success => {
        if (success) {
          this.submit(formData)
        } else {
          this.setState({ errors })
        }
      })
    
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

### Changing the local for ReeValidate

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

        this.validator = new ReeValidate({
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
