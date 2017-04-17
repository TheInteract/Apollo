import PropTypes from 'prop-types'
import React from 'react'

const NoMatch = ({ url }) => (
  <div>
    404 - {url} Not Found
  </div>
)

NoMatch.propTypes = {
  url: PropTypes.string
}

export default NoMatch
