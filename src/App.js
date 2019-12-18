import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import IntroText from './components/IntroText'
import Editor from './components/Editor'


function App() {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Simple Text Editor</Typography>
        </Toolbar>
      </AppBar>

      <Box m={3}>
        <IntroText />

        <Box m={1} ml={0}>
          <Editor />
        </Box>
      </Box>
    </div>
  )
}

export default App
