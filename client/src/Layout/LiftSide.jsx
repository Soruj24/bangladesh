import AddDistrict from "../components/item/AddDistrict"
import AddDivision from "../components/item/AddDivision"
import AddUnion from "../components/item/AddUnion"
import AddUpazila from "../components/item/AddUpazila"
import AddVillage from "../components/item/AddVillage"


const LiftSide = () => {
  return (
    <div >
      <AddDivision />
      <AddDistrict />
      <AddUpazila />
      <AddUnion />
      <AddVillage />
    </div>
  )
}

export default LiftSide