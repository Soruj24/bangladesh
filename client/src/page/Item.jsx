import DistrictShow from "../components/DistrictShow";
import DivisionShow from "../components/DivisionShow";
import ModalDistric from "../components/modal all data add/ModalDistric";
import ModalDivision from "../components/modal all data add/ModalDivision";
import ModalUnion from "../components/modal all data add/ModalUnion";
import ModalUpazila from "../components/modal all data add/ModalUpazila";
import ModelVillage from "../components/modal all data add/ModelVillage";
import UnionShow from "../components/UnionShow";
import UpazilaShow from "../components/UpazilaShow";
import VillageShow from "../components/VillageShow";


const Item = () => {

    return (
        <>
            <div className="flex justify-center space-x-3 my-3">
                <ModalDivision />
                <ModalDistric />
                <ModalUpazila />
                <ModalUnion />
                <ModelVillage />

            </div>
            <div className="grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {/* <div className="py-6">
                    <LiftSide />
                </div> */}
                <div className="py-6">
                    <DivisionShow />
                </div>
                <div className="py-6">
                    <DistrictShow />
                </div>
                <div className="py-6">
                    <UpazilaShow />
                </div>
                <div className="py-6">
                    <UnionShow />
                </div>
                <div className="py-6">
                    <VillageShow />
                </div>
            </div>
        </>
    );
};

export default Item;
