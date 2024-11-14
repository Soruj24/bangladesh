import { useState } from "react";
import { useGetDivisionsQuery } from "../services/divisionApi";

const Division = () => {
    const { data, error, isLoading } = useGetDivisionsQuery();
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedUpazila, setSelectedUpazila] = useState(null);
    const [selectedUnion, setSelectedUnion] = useState(null);
    const [selectedVillage, setSelectedVillage] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    console.log(data); // Log to check the structure of the data

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading divisions</div>;

    const handleDivisionChange = (e) => {
        setSelectedDivision(e.target.value);
        setSelectedDistrict(null); // Reset lower levels when changing the division
        setSelectedUpazila(null);
        setSelectedUnion(null);
        setSelectedVillage(null);
        console.log("Selected Division:", e.target.value);
    };

    const handleDistrictChange = (e) => {
        setSelectedDistrict(e.target.value);
        setSelectedUpazila(null);
        setSelectedUnion(null);
        setSelectedVillage(null);
        console.log("Selected District:", e.target.value);
    };

    const handleUpazilaChange = (e) => {
        setSelectedUpazila(e.target.value);
        setSelectedUnion(null);
        setSelectedVillage(null);
        console.log("Selected Upazila:", e.target.value);
    };

    const handleUnionChange = (e) => {
        setSelectedUnion(e.target.value);
        setSelectedVillage(null);
        console.log("Selected Union:", e.target.value);
    };

    const handleVillageChange = (e) => {
        setSelectedVillage(e.target.value);
        console.log("Selected Village:", e.target.value);
    };

    const renderDistricts = (divisionId) => {
        console.log("divisionId", divisionId)
        const division = data?.divisions?.find((d) => d.id === divisionId);
        return division?.districts.map((district) => (
            <option key={district.id} value={district.id}>
                {district.name}
            </option>
        ));
    };

    const renderUpazilas = (districtId) => {
        const division = data?.divisions?.find((d) => d.id === selectedDivision);
        const district = division?.districts?.find((d) => d.id === districtId);
        return district?.upazilas.map((upazila) => (
            <option key={upazila.id} value={upazila.id}>
                {upazila.name}
            </option>
        ));
    };

    const renderUnions = (upazilaId) => {
        const division = data?.divisions?.find((d) => d.id === selectedDivision);
        const district = division?.districts?.find((d) => d.id === selectedDistrict);
        const upazila = district?.upazilas?.find((u) => u.id === upazilaId);
        return upazila?.unions.map((union) => (
            <option key={union.id} value={union.id}>
                {union.name}
            </option>
        ));
    };

    const renderVillages = (unionId) => {
        const division = data?.divisions?.find((d) => d.id === selectedDivision);
        const district = division?.districts?.find((d) => d.id === selectedDistrict);
        const upazila = district?.upazilas?.find((u) => u.id === selectedUpazila);
        const union = upazila?.unions?.find((u) => u.id === unionId);
        return union?.villages?.map((village) => (
            <option key={village.id} value={village.id}>
                {village.name}
            </option>
        ));
    };

    return (
        <div>
            <h1>Division List</h1>

            {/* Division Dropdown */}
            <select
                onChange={handleDivisionChange}
                value={selectedDivision || ""}
                className="mb-4 p-2 border rounded"
            >
                <option value="" disabled>
                    Select a Division
                </option>
                {data?.divisions.map((division) => (

                        <option key={division.id} value={division.id}>
                            {division.name}
                        </option>
                ))}
            </select>

            {/* District Dropdown */}
            {selectedDivision && (
                <select
                    onChange={handleDistrictChange}
                    value={selectedDistrict || ""}
                    className="mb-4 p-2 border rounded"
                >
                    <option value="" disabled>
                        Select a District
                    </option>
                    {renderDistricts(selectedDivision)}
                </select>
            )}

            {/* Upazila Dropdown */}
            {selectedDistrict && (
                <select
                    onChange={handleUpazilaChange}
                    value={selectedUpazila || ""}
                    className="mb-4 p-2 border rounded"
                >
                    <option value="" disabled>
                        Select an Upazila
                    </option>
                    {renderUpazilas(selectedDistrict)}
                </select>
            )}

            {/* Union Dropdown */}
            {selectedUpazila && (
                <select
                    onChange={handleUnionChange}
                    value={selectedUnion || ""}
                    className="mb-4 p-2 border rounded"
                >
                    <option value="" disabled>
                        Select a Union
                    </option>
                    {renderUnions(selectedUpazila)}
                </select>
            )}

            {/* Village Dropdown */}
            {selectedUnion && (
                <select
                    onChange={handleVillageChange}
                    value={selectedVillage || ""}
                    className="mb-4 p-2 border rounded"
                >
                    <option value="" disabled>
                        Select a Village
                    </option>
                    {renderVillages(selectedUnion)}
                </select>
            )}
        </div>
    );
};

export default Division;
