import React, { FC } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Snow } from './Snow'
import { Global, css } from '@emotion/react'
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
    <Global styles={globalStyle} />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/snow" element={<Snow />} />
      <Route path="/untitled1" element={<Untitled1 />} />
    </Routes>
  </BrowserRouter>
)

const container = document.getElementById('app')
if (!container) throw new Error('Failed to find the root element')

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
