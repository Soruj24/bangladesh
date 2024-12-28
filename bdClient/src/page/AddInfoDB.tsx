import { AddDistricts } from "@/components/AllAddInfo/AddDistricts"
import { AddDivision } from "@/components/AllAddInfo/AddDivision"
import { AddUnion } from "@/components/AllAddInfo/AddUnion"
import { AddUpazila } from "@/components/AllAddInfo/AddUpazila"
import { AddVillage } from "@/components/AllAddInfo/AddVillage"


const AddInfoDB = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 mt-3  md:grid-cols-2 xl:grid-cols-5 gap-4">
            <AddDivision />
            <AddDistricts />
            <AddUpazila />
            <AddUnion />
            <AddVillage />
        </div>
    )
}

export default AddInfoDB