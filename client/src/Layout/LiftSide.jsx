import AddDistrict from "../components/item/AddDistrict"
import AddDivision from "../components/item/AddDivision"
import AddUpazila from "../components/item/AddUpazila"
import AddVillage from "../components/item/AddVillage"
import { Link } from "react-router-dom"


const LiftSide = () => {
  return (
    <div>
      <div className="bg-gray-200 p-4 flex gap-5 ">
        <Link to='/'>Home</Link>
        <Link to='/item'>Items</Link>
        <Link to='/login'>Add User</Link>
      </div>
      <AddDivision />
      <AddDistrict />
      <AddUpazila />
      <AddVillage />
    </div>
  )
}

export default LiftSide