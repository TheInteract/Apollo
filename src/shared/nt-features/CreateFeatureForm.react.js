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
    this.state = {
      name: undefined,
      A: 50,
      B: 50,
    }
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
    if (this.state.name && this.state.name !== '') {
      this.props.mutate({
        variables: {
          name: this.state.name,
          productId: this.props.productId,
          proportion: {
            A: this.state.A,
            B: this.state.B,
          }
        },
      })
    } else {
      e.preventDefault()
    }
  }

  renderError = () => this.state.name === '' ? (
    <span> Name is required</span>
  ) : null

  renderProportionInput = version => (
    <div className={styles[`n__${version}`]}>
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
      <form className={styles.n} onSubmit={this.handleSubmit}>
        <div className={styles.n__name}>
          Name:
          <input
            type='text'
            onChange={this.handleNameChange}
          />
          {this.renderError()}
        </div>
        <div className={styles.n__proportion}>
          {this.renderProportionInput('A')}
          {this.renderProportionInput('B')}
        </div>
        <div className={styles.n__submit}>
          <input type='submit' value='Submit' />
        </div>
      </form>
    )
  }
}

export default enhance(CreateFeatureForm)
