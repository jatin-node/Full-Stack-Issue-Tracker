import React from 'react'

const NoDataMessage = ({message}) => {
  return (
    <div className='text-center font-semibold w-full rounded-full bg-zinc-100 p-4'>
      <p>{message}</p>
    </div>
  )
}

export default NoDataMessage
