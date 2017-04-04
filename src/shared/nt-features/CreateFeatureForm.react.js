import gql from 'graphql-tag'
import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import styles from './CreateFeatureForm.styl'

const featureMutation = gql`
  mutation createFeature($name: String!, $productId: String!, $proportion: InputProportion!) {
    createFeature(name: $name, productId: $productId, proportion: $proportion) {
      _id
      name
      proportion {
        A
        B
      }
    }
  }
`

const enhance = compose(
  graphql(featureMutation)
)

class CreateFeatureForm extends React.Component {
  static propTypes = {
    mutate: React.PropTypes.func.isRequired,
    productId: React.PropTypes.string.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      name: '',
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

  handleSubmit = () => {
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
  }

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
            value={this.state.name}
            onChange={this.handleNameChange}
          />
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
