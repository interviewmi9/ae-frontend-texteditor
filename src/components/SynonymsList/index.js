import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'

const OneLineListItemText = styled(ListItemText)`
  white-space: nowrap;
`

const SynonymsList = ({ keyword, applyWord }) => {
  const [activeKeyword, setActiveKeyword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasError, setErrors] = React.useState(false)
  const [synonymsList, setSynonymsList] = React.useState([])

  async function fetchSynonymsList(keyword) {
    if (!keyword) {
      return null
    }

    setIsLoading(true)
    setActiveKeyword(keyword)
    setSynonymsList([])
    const res = await fetch(`https://api.datamuse.com/words?rel_syn=${keyword}`)
    res
      .json()
      .then(res => {
        setSynonymsList(res.slice(0, 5))
      })
      .catch(err => setErrors(err))
      .finally(() => setIsLoading(false))
  }

  React.useEffect(() => {
    if (keyword) {
      fetchSynonymsList(keyword)
    }
  }, [keyword])

  let keywordText = <b>{activeKeyword}</b>
  if (!activeKeyword) {
    keywordText = <i>Double click a word to load synonyms list</i>
  }

  return (
    <React.Fragment>
      <List component="nav" aria-label="synonym lookup keyword">
        <ListItem>
          <OneLineListItemText primary={keywordText} />
          {isLoading && <CircularProgress size={20} />}
        </ListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="available synonyms list">
        {synonymsList.map((item, index) => (
          <ListItem
            button
            key={item.word}
            onMouseDown={e => e.preventDefault()}
            onClick={e => {
              applyWord(item.word)
              e.preventDefault()
            }}
            title="Use this synonym"
          >
            <OneLineListItemText primary={`${index + 1}. ${item.word}`} />
          </ListItem>
        ))}
        {!isLoading && keyword && !synonymsList.length && (
          <ListItem key="no-results">
            <OneLineListItemText primary="No synonyms found" />
          </ListItem>
        )}
        {hasError && (
          <ListItem key="error">
            <OneLineListItemText primary="Error while fetching synonyms list" />
          </ListItem>
        )}
      </List>
    </React.Fragment>
  )
}

SynonymsList.propTypes = {
  keyword: PropTypes.string,
  applyWord: PropTypes.func.isRequired,
}

export default React.memo(SynonymsList)
