import App from './App'
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

describe('App test', () => {
  test('render without errors', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    expect(screen.getByText(/Minnesota Winter League/i)).toBeDefined()
  })
})
