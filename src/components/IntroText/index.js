import React from 'react'
import Typography from '@material-ui/core/Typography'

function IntroText() {
  return (
    <React.Fragment>
      <Typography variant="h4">
        Text Editor component with a synonym lookup complication
      </Typography>
      <Typography variant="h6">
        This service will allow you to format your text as well as find and
        replace synonyms using <a href="https://www.datamuse.com/api/">datamuse.com</a> database
      </Typography>
    </React.Fragment>
  )
}

export default IntroText
