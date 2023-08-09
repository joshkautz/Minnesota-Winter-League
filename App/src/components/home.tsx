export const Home = () => {
  const scrollTest = Array.from({ length: 100 })
  return (
    <div className='flex flex-col items-center flex-1'>
      {scrollTest.map(() => (
        <div>hello</div>
      ))}
    </div>
  )
}
