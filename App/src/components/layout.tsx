import { TopNav } from './top-nav'
import { Outlet } from 'react-router-dom'

const content = [
  { label: 'Home', path: '/', alt: 'home page' },
  { label: 'Schedule', path: '/schedule', alt: 'league schedule' },
  { label: 'Standings', path: '/standings', alt: 'league standings' },
  { label: 'Teams', path: '/teams', alt: 'team list' },
]

export const Layout = () => {
  return (
    <div className='flex flex-col items-stretch justify-start min-h-screen'>
      <TopNav title={'Minnesota Winter League'} content={content} />
      <Outlet />
    </div>
  )
}
