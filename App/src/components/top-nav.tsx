import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { ScrollArea } from './ui/scroll-area'

export const TopNav = ({
  content,
  title,
}: {
  content: { label: string; path: string; alt: string }[]
  title: string
}) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur'>
      <div className='container flex items-center h-14'>
        {/* Nav */}
        <div className='hidden mr-4 md:flex'>
          <Link to='/' className='flex items-center mr-6 space-x-2'>
            <div className='w-6 h-6 rounded-full bg-primary' />
            <span className='hidden font-bold sm:inline-block'>{title}</span>
          </Link>
          <nav className='flex items-center space-x-6 text-sm font-medium'>
            {content.map((entry) => (
              <Link
                to={entry.path}
                className={
                  'transition-colors hover:text-foreground/80 text-foreground/60'
                }
              >
                {entry.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              className='px-0 mr-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
            >
              <HamburgerMenuIcon className='w-5 h-5' />
              <span className='sr-only'>Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side={'top'} className='pr-0'>
            <Link to='/' className='flex items-center' onClick={handleClick}>
              <div className='w-6 h-6 rounded-full bg-primary' />
              <span className='hidden font-bold sm:inline-block'>
                Winter League
              </span>
            </Link>
            <ScrollArea className='my-4 h-[calc(100vh-8rem)] pb-10 pl-6'>
              <div className='flex flex-col space-y-3'>
                {content.map((entry) => (
                  <Link to={entry.path} onClick={handleClick}>
                    {entry.label}
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
