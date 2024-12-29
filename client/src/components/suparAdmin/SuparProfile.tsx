import DistrictAdd from "./DistrictAdd";
import Division from "./DivisionAdd";
import UnionAdd from "./UnionAdd";
import UpozilaAdd from "./UpozilaAdd";
import VillageAdd from "./VillageAdd";

const SuparProfile = () => {
    return (
        <div className="mt-2 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <Division />
                <DistrictAdd />
                <UpozilaAdd />
                <UnionAdd />
                <VillageAdd />
            </div>
        </div>
    );
};

export default SuparProfile;
