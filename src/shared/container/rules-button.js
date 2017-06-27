// @flow

import { connect } from 'react-redux'

import { rules } from '../action/relay'
import Button from '../component/button'

const mapStateToProps = () => ({
  label: 'Say hello',
})

const mapDispatchToProps = dispatch => ({
  handleClick: () => { dispatch(rules('Hello!')) },
})

export default connect(mapStateToProps, mapDispatchToProps)(Button)
