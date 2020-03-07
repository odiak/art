import React, { FC } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { Snow } from './Snow'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'
import { Untitled1 } from './Untitled1'

const globalStyle = css`
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  #app {
    width: 100%;
    height: 100%;
  }
`

const Container = styled.div`
  padding: 8px;
`

const Index: FC<{}> = () => (
  <Container>
    <h1>Digital arts by odiak</h1>
    <ul>
      <li>
        <Link to="/snow">Snow</Link>
      </li>
      <li>
        <Link to="/untitled1">Untitled 1</Link>
      </li>
    </ul>
  </Container>
)

const App = () => (
  <BrowserRouter>
    <>
      <Global styles={globalStyle} />
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/snow" component={Snow} />
        <Route path="/untitled1" component={Untitled1} />
      </Switch>
    </>
  </BrowserRouter>
)

render(<App />, document.getElementById('app'))
