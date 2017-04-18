import classNames from 'classnames'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import styles from './CreateFeatureForm.styl'

const createFeature = gql`
  mutation createFeature($name: String!, $productId: String!, $proportion: InputProportion!) {
    createFeature(name: $name, productId: $productId, proportion: $proportion) {
      _id
      productId
      name
      proportion {
        A
        B
      }
    }
  }
`

const initialState = {
  name: '',
  A: 50,
  B: 50,
  loading: false
}

const enhance = compose(
  graphql(createFeature)
)

class CreateFeatureForm extends React.Component {
  static propTypes = {
    mutate: PropTypes.func.isRequired,
    productId: PropTypes.string.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = { ...initialState }
  }

  validateProportion = value => (
    value > 100 ? 100 : value < 0 ? 0 : value
  )

  handleNameChange = event => {
    this.setState({ name: event.target.value })
  }

  handleProportionChange = version => event => {
    const value = this.validateProportion(event.target.value)
    switch (version) {
      case 'A':
        this.setState({
          A: value,
          B: 100 - value,
        })
        break
      case 'B':
        this.setState({
          A: 100 - value,
          B: value,
        })
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.name && this.state.name !== '') {
      this.setState({ loading: true })
      this.props
        .mutate({
          variables: {
            name: this.state.name,
            productId: this.props.productId,
            proportion: {
              A: this.state.A,
              B: this.state.B,
            }
          }
        })
        .then(() => {
          this.setState({ ...initialState })
        })
        .catch(e => {
          console.error(e)
        })
    }
  }

  renderError = () => this.state.name === '' ? (
    <span> Name is required</span>
  ) : null

  renderProportionInput = version => (
    <div className={styles[`nt__${version}`]}>
      Expected {version}:
      <input
        type='number'
        value={this.state[version]}
        onChange={this.handleProportionChange(version)}
      /> %
    </div>
  )

  render () {
    return (
      <form className={styles.nt} onSubmit={this.handleSubmit}>
        <div className={styles.nt__name}>
          Name:
          <input
            value={this.state.name}
            type='text'
            onChange={this.handleNameChange}
          />
          {this.renderError()}
        </div>
        <div className={styles.nt__proportion}>
          {this.renderProportionInput('A')}
          {this.renderProportionInput('B')}
        </div>
        <div className={styles.nt__submit}>
          <button
            type='submit'
            className={
              classNames({
                [styles['--loading']]: this.state.loading
              })
            }
            disabled={this.state.loading}
          >
            Submit
          </button>
        </div>
      </form>
    )
  }
}

export default enhance(CreateFeatureForm)
