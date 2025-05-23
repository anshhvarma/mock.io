import React from 'react'
import AddNewInterview from './_components/AddNewInterview'

function Dashboard() {
  return (
    <div className='pt-10'>
        <h2 className='font-bold text-2xl'>
          Dashboard
        </h2>
        <h2 className='text-gray-500'>
          Create and Start your AI Mock Interview
        </h2>
        <div className='gird grid-cols-1 md:grid-cols-3 my-5'>
          <AddNewInterview />
        </div>
    </div>
  )
}

export default Dashboard