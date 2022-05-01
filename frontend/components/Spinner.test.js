// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import Spinner from './Spinner'
import { render, screen } from '@testing-library/react'

// test('sanity', () => {
//   expect(true).toBe(true)
// })

test('renders correctly when spinner is on', () => {
    render(<Spinner on/>)
    const foundText = screen.queryByText('Please wait...')
    expect(foundText).toBeTruthy();
})


test('does not render when spinner is off', () => {
  render(<Spinner on={false}/>)
  const foundText = screen.queryByText('Please wait...')
    expect(foundText).toBeFalsy();
})