import React from 'react'

import styles from './CreateFeatureForm.styl'

class CreateFeatureForm extends React.Component {

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
    console.log('submit')
  }

  renderProportionInput = version => (
    <div className={styles.proportion}>
      {version}
      <input
        type='number'
        value={this.state[version]}
        onChange={this.handleProportionChange(version)}
      />
    </div>
  )

  render () {
    return (
      <form className={styles.form} onSubmit={this.handleSubmit}>
        <div className={styles.left}>
          <div className={styles.name}>
            Name
            <input
              type='text'
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </div>
          <div className={styles.proportionContainer}>
            {this.renderProportionInput('A')}
            {this.renderProportionInput('B')}
          </div>
        </div>
        <div className={styles.right}>
          <input className={styles.submit} type='submit' value='Submit' />
        </div>
      </form>
    )
  }
}

export default CreateFeatureForm
