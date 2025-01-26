import { useState } from "react"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { toast } from "@/hooks/use-toast"
import { useDeleteDistrictMutation, useGetAllDistrictsQuery, useUpdateDistrictMutation } from "@/services/districtApi"

interface District {
    id: string;
    name: string;
}

interface Division {
    _id: string;
    name: string;
}

const DistrictShow = () => {
    const { data, error,isLoading,  refetch } = useGetAllDistrictsQuery<{ district: District[] }>();
    const [updateDistrict] = useUpdateDistrictMutation();
    const [deleteDistrict] = useDeleteDistrictMutation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentDivision, setCurrentDivision] = useState<Division | null>(null);

    const handleDelete = async (id: string) => {
        
        const res = await deleteDistrict({ districtId:id });
        
        if (res?.error) {
            toast({
                title: "Error",
                description: 'data' in res.error ? (res.error.data as { message: string }).message : "An error occurred",
                variant: "destructive",
            });
        } else {
            toast({
                title: 'Success',
                description: 'Division deleted successfully',
                variant: 'default',
            });
            refetch();
        }
    };

    const handleUpdate = (district: District) => {
        setCurrentDivision({ _id: district.id, name: district.name });
        setIsDialogOpen(true);
    };

    const handleUpdateSubmit = async (updatedDivision: Division | null) => {
        if (!updatedDivision || !updatedDivision?.name?.trim()) {
            toast({
                title: "Error",
                description: "Division name cannot be empty",
                variant: "destructive",
            });
            return;
        }

        try {
              await updateDistrict({
                districtId: updatedDivision._id,
                name: updatedDivision.name,
            }).unwrap();

            toast({
                title: 'Success',
                description: 'Division updated successfully',
                variant: 'default',
            });

            refetch();
            setIsDialogOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: (error as { data?: { message?: string } })?.data?.message || "Failed to update division",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(data?.district?.length || 1)].map((_, index) => (
                    <Card key={index} className="max-w-xs p-4 border shadow-lg">
                        <CardHeader>
                            <Skeleton className="w-24 h-6" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="w-full h-16" />
                        </CardContent>
                        <CardFooter className="flex space-x-2">
                            <Skeleton className="w-20 h-8" />
                            <Skeleton className="w-20 h-8" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return <h1>Error</h1>;
    }

    return (
        <div className="mt-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.district?.map((district: District) => (
                <Card key={district.id} className="max-w-xs p-4 border shadow-lg">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{district.name}</h2>
                    </CardHeader>
                    <CardContent>
                        <p>{district.name}</p>
                    </CardContent>
                    <CardFooter className="flex space-x-2">
                        <Button onClick={() => handleDelete(district._id)}>Delete</Button>
                        <Button onClick={() => handleUpdate(district)}>Update</Button>
                    </CardFooter>
                </Card>
            ))}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Division</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-sm font-semibold">Division Name</span>
                            <input
                                type="text"
                                value={currentDivision?.name || ""}
                                onChange={(e) =>
                                    currentDivision &&
                                    setCurrentDivision({ ...currentDivision, name: e.target.value })
                                }
                                className="mt-2 p-2 text-black border rounded-md w-full"
                            />
                        </label>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => handleUpdateSubmit(currentDivision)}>Update</Button>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DistrictShow;

