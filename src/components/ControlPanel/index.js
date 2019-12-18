import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import styled from 'styled-components'

const BottomlessButtonGroup = styled(ButtonGroup)`
  .MuiButton-root {
    border-bottom: 0 !important;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    min-height: 36px;
  }
`

const inlineButtons = [
  {
    value: 'Bold',
    style: 'BOLD',
    content: <b>B</b>,
  },

  {
    value: 'Italic',
    style: 'ITALIC',
    content: <i>I</i>,
  },

  {
    value: 'Underline',
    style: 'UNDERLINE',
    content: <u>U</u>,
  },
]

const ControlPanel = ({ editorStyle, onCommand }) => {
  return (
    <BottomlessButtonGroup color="primary" aria-label="editor toolbar">
      {inlineButtons.map((button, index) => (
        <Button
          key={index}
          onMouseDown={e => e.preventDefault()}
          onClick={e => onCommand(button.style)}
          type="button"
          title={button.value}
          variant={editorStyle.has(button.style) ? 'contained' : ''}
          color={editorStyle.has(button.style) ? 'secondary' : ''}
        >
          {button.content}
        </Button>
      ))}
    </BottomlessButtonGroup>
  )
}

ControlPanel.propTypes = {
  editorStyle: PropTypes.shape({
    has: PropTypes.func.isRequired,
  }).isRequired,
  onCommand: PropTypes.func.isRequired,
}

export default ControlPanel
