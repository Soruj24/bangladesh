import { Outlet } from 'react-router-dom'
import LiftSide from './Layout/LiftSide'
function App() {

  return (
    <>
      <div className='container mx-auto'>
        <div className="flex">
          <div className="w-1/6 bg-gray-200 ">
            <LiftSide />
          </div>
          <div className="w-5/6 ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
