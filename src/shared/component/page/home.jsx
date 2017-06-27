// @flow

import React from 'react'
import Helmet from 'react-helmet'
import injectSheet from 'react-jss'

import ModalExample from '../modal-example'
import { APP_NAME } from '../../config'

const styles = {
  hoverMe: {
    '&:hover': {
      color: 'red',
    },
  },
  '@media (max-width: 800px)': {
    resizeMe: {
      color: 'red',
    },
  },
  specialButton: {
    composes: ['btn', 'btn-primary'],
    backgroundColor: 'limegreen',
  },
}

const HomePage = ({ classes }: { classes: Object }) =>
  <div>
    <Helmet
      meta={[
        { name: 'description', content: 'RELAY - network infrastructure via mobile devices' },
        { name: 'author', content: 'RELAY project' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
        { property: 'og:title', content: APP_NAME },
      ]}
    >
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    </Helmet>
    <div className="container">
      <div className="embed-responsive embed-responsive-16by9">
        <iframe className="embed-responsive-item" src="https://player.vimeo.com/video/223020412" webkitAllowFullscreen mozAllowFullScreen allowFullScreen />
      </div>
      <br />
      <div className="row">
        <div className="col-md-6 mb-6">
          <h3 className="mb-3">RELAY</h3>
          <p>
            {/* eslint-disable no-trailing-spaces*/}
            In the last two decades the Internet has become an essential means of communication 
            and sharing knowledge between people. More than 50% of the world population still 
            doesn&apos;t have access to the Internet. RELAY provides network infrastructure via 
            mobile devices to users who live in remote locations where there is limited or no 
            access to the internet.
            {/* eslint-enable no-trailing-spaces*/}
            <br />
            <button type="button" role="button" data-toggle="modal" data-target=".js-modal-example" className="btn btn-primary">Open Modal</button>
          </p>
        </div>
        <div className="col-md-6 mb-6">
          <h3 className="mb-3">Contact Us</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <p>
                <button type="button" role="button" data-toggle="github" data-target="https://  github.com/omerel/RELAY/" className="btn   btn-default">
                  <i className="fa fa-github" /> RELAY FE repo
                </button>
              </p>
              <p>
                <button type="button" role="button" href="https://github.com/barrinbar/RELAY/" className="btn   btn-default">
                  <i className="fa fa-github" /> RELAY BE rep
                </button>
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <p>
                <button type="button" role="button" data-toggle="gmail" href="mailto:elomer@gmail.com" className="btn   btn-default">
                  <i className="fa fa-gmail" /> Mail Omer
                </button>
              </p>
              <p>
                <button type="button" role="button" data-toggle="github" href="mailto:barronbar@gmail.com" className="btn btn-default">
                  <i className="fa fa-gmail" /> Mail Barr
                </button>
              </p>
              <p className={classes.hoverMe}>Hover me.</p>
              <p className={classes.resizeMe}>Resize the window.</p>
              <button className={classes.specialButton}>  Composition</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalExample />
  </div>

export default injectSheet(styles)(HomePage)
