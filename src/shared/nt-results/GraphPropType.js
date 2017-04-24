import PropTypes from 'prop-types'

const GraphPropType = PropTypes.shape({
  nodes: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })).isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({
    source: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })).isRequired,
  paths: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
    })),
    count: PropTypes.number.isRequired,
  }))
})

export default GraphPropType
