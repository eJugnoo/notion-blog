import Link from 'next/link'
import Features from '../components/features'
import React from 'react'
import Router from 'next/router'
import { NextAuth } from 'next-auth/client'

export default class extends React.Component {
  static async getInitialProps({ req }) {
    return {
      session: await NextAuth.init({ req, force: false }),
    }
  }

  constructor(props) {
    super(props)
    this.handleSignOutSubmit = this.handleSignOutSubmit.bind(this)
  }

  handleSignOutSubmit(event) {
    event.preventDefault()
    NextAuth.signout()
      .then(() => {
        Router.push('/auth/callback')
      })
      .catch(err => {
        Router.push('/auth/error?action=signout')
      })
  }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-light bg-light">
          <div className="container">
            <a className="navbar-brand" href="#">
              Process Automation Lifecycle
            </a>
            <SignInMessage {...this.props} />
          </div>
        </nav>
        <div className="container">
          <div className="text-center"></div>
        </div>
      </React.Fragment>
    )
  }
}

export class SignInMessage extends React.Component {
  render() {
    if (this.props.session.user) {
      return (
        <React.Fragment>
          <p>
            <Link href="/auth">
              <a className="btn btn-secondary">Manage Account</a>
            </Link>
          </p>
          <form
            id="signout"
            method="post"
            action="/auth/signout"
            class="form-inline"
            onSubmit={this.handleSignOutSubmit}
          >
            <input
              name="_csrf"
              type="hidden"
              value={this.props.session.csrfToken}
            />
            <button type="submit" className="btn btn-outline-secondary">
              Sign out
            </button>
          </form>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <form
            id="signout"
            method="post"
            action="/auth/signout"
            className="form-inline"
            onSubmit={this.handleSignOutSubmit}
          >
            <Link href="/auth">
              <a className="btn btn-sm btn-primary">Sign in</a>
            </Link>
          </form>
        </React.Fragment>
      )
    }
  }
}
