import DistrictShow from "../components/DistrictShow";
import DivisionShow from "../components/DivisionShow";
import UnionShow from "../components/UnionShow";
import UpazilaShow from "../components/UpazilaShow";
import VillageShow from "../components/VillageShow";


const Item = () => {

    return (
        <div className="grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
            <div>
                <DivisionShow />
            </div>
            <div>
                <DistrictShow />
            </div>
            <div>
                <UpazilaShow />
            </div>
            <div>
                <UnionShow />
            </div>
            <div>
                <VillageShow />
            </div>
        </div>
    );
};

export default Item;
