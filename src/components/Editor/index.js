import React from 'react'
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  Modifier,
} from 'draft-js'
import tokenizeWords from 'talisman/tokenizers/words'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import ControlPanel from '../ControlPanel'
import SynonymsList from '../SynonymsList'

const maxWordLength = 25

const EditorBox = styled.div`
  border: 1px solid rgba(63, 81, 181, 0.5);
  padding: 10px;
  .DraftEditor-root {
    min-height: 150px;
  }
`

const getSelectionParams = state => {
  const selectionState = state.getSelection()
  const anchorKey = selectionState.getAnchorKey()
  const currentContent = state.getCurrentContent()
  const currentContentBlock = currentContent.getBlockForKey(anchorKey)
  const start = selectionState.getStartOffset()
  const end = selectionState.getEndOffset()
  const isCollapsed = selectionState.isCollapsed()
  const currentlySelectedText = currentContentBlock.getText().slice(start, end)

  return {
    selectionState,
    currentContent,
    start,
    end,
    currentlySelectedText,
    isCollapsed,
  }
}

export default function SimpleTextEditor() {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      ContentState.createFromText(
        `"Imagine that you are involved into development of a data knowledge storing system, like Wiki or Confluence. At some point you'd need to provide users with a possibility of advanced text formatting. For this purpose it was decided to build a separate component in order to be able to customize its functionality in the future."`
      )
    )
  )
  const [selectedWord, setSelectedWord] = React.useState('')

  const editor = React.useRef(null)

  const focusEditor = () => {
    editor.current.focus()
  }

  const onChange = (newState, updateSelectedWord = true) => {
    setEditorState(newState)

    if (updateSelectedWord) {
      const { currentlySelectedText } = getSelectionParams(newState)
      const word = tokenizeWords(currentlySelectedText)[0] || ''
      setSelectedWord(word.substring(0, maxWordLength))
    }
  }

  const replaceSelectedText = newText => {
    const {
      currentContent,
      selectionState,
      currentlySelectedText,
      isCollapsed,
    } = getSelectionParams(editorState)
    if (isCollapsed) {
      return null
    }

    const newContent = Modifier.replaceText(
      currentContent,
      selectionState,
      newText,
      editorState.getCurrentInlineStyle()
    )

    const newEditorState = EditorState.push(
      editorState,
      newContent,
      'insert-characters'
    )

    const before = newContent.getSelectionBefore()

    const newSelectionState = before.merge({
      anchorOffset: before.anchorOffset,
      focusOffset:
        before.focusOffset - currentlySelectedText.length + newText.length,
      anchorKey: before.anchorKey,
      focusKey: before.focusKey,
    })

    const newEditorStageWithSelection = EditorState.forceSelection(
      newEditorState,
      newSelectionState
    )

    onChange(newEditorStageWithSelection, false)
  }

  const applyInlineCommand = command => {
    onChange(RichUtils.toggleInlineStyle(editorState, command))
  }

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      onChange(newState)
    }
  }

  React.useEffect(() => {
    focusEditor()
  }, [])

  return (
    <React.Fragment>
      <Grid container spacing={0}>
        <Grid key="editor" item xs={9}>
          <Box mt="28px" mr={5}>
            <ControlPanel
              onCommand={applyInlineCommand}
              editorStyle={editorState.getCurrentInlineStyle()}
            />
            <EditorBox>
              <Editor
                ref={editor}
                editorState={editorState}
                onChange={onChange}
                handleKeyCommand={handleKeyCommand}
              />
            </EditorBox>
          </Box>
        </Grid>
        <Grid key="synonyms" item xs={3}>
          <SynonymsList
            keyword={selectedWord}
            applyWord={replaceSelectedText}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
