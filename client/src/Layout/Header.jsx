import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className='flex gap-5'>
            <Link to="/">Home</Link>
        </div>
    )
}

export default Header