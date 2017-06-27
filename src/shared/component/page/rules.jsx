// @flow

import React from 'react'
import Helmet from 'react-helmet'

import Message from '../../container/message'
import RulesButton from '../../container/rules-button'

const title = 'Rules Page'

const RulesPage = () =>
  <div className="container mt-4">
    <Helmet
      title={title}
      meta={[
        { name: 'description', content: 'Reviewing the rules' },
        { property: 'og:title', content: title },
      ]}
    />
    <div className="row">
      <div className="col-12">
        <h1>{title}</h1>
        <Message />
        <RulesButton />
      </div>
    </div>
  </div>

export default RulesPage
