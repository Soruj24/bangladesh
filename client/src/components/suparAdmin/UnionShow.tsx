import { useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
    useDeleteUnionMutation,
    useGetAllUnionsQuery,
    useUpdateUnionMutation,
} from "@/services/unionsApi";

const UnionShow = () => {
    const { data, isError, isLoading, refetch } = useGetAllUnionsQuery();
    const [updateUnion] = useUpdateUnionMutation();
    const [deleteUnion] = useDeleteUnionMutation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    interface Union {
        _id: string;
        name: string;
    }

    const [currentUnion, setCurrentUnion] = useState<Union | null>(null);

    // Handle delete functionality
    const handleDelete = async (id: string) => {
        try {
             await deleteUnion(id).unwrap();

            toast({
                title: "Success",
                description: "Union deleted successfully",
                variant: "default",
            });
            refetch();
        } catch (error) {
            toast({
                title: "Error",
                description:
                    (error as { data?: { message?: string } })?.data?.message || "Failed to delete union",
                variant: "destructive",
            });
        }
    };

    // Open update dialog
    const handleUpdate = (union: Union) => {
        setCurrentUnion(union);
        setIsDialogOpen(true);
    };

    // Handle update submission
    const handleUpdateSubmit = async (updatedUnion: Union) => {
        if (!updatedUnion?.name?.trim()) {
            toast({
                title: "Error",
                description: "Union name cannot be empty",
                variant: "destructive",
            });
            return;
        }

        try {
            const res = await updateUnion({ ...updatedUnion, unionId: updatedUnion._id }).unwrap();
            console.log("Update response:", res); // Debugging response

            toast({
                title: "Success",
                description: "Union updated successfully",
                variant: "default",
            });

            refetch(); // Refresh the unions list
            setIsDialogOpen(false); // Close dialog
        } catch (error) {
            console.error("Update error:", error); // Debugging error
            toast({
                title: "Error",
                description:
                    (error as { data?: { message?: string } })?.data?.message || "Failed to update union",
                variant: "destructive",
            });
        }
    };

    // Render loading state
    if (isLoading) {
        return (
            <div className="space-y-6 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
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

    // Render error state
    if (isError) {
        return <h1>Error loading unions</h1>;
    }

    return (
        <div className="mt-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.union?.map((union: Union) => (
                <Card key={union._id} className="max-w-xs p-4 border shadow-lg">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{union.name}</h2>
                    </CardHeader>
                    <CardContent>
                        <p>{union.name}</p>
                    </CardContent>
                    <CardFooter className="flex space-x-2">
                        <Button onClick={() => handleDelete(union._id)}>Delete</Button>
                        <Button onClick={() => handleUpdate(union)}>Update</Button>
                    </CardFooter>
                </Card>
            ))}

            {/* Update Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Union</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-sm font-semibold">Union Name</span>
                            <input
                                type="text"
                                value={currentUnion?.name || ""}
                                onChange={(e) =>
                                    setCurrentUnion(
                                        currentUnion
                                            ? { ...currentUnion, name: e.target.value }
                                            : null
                                    )
                                }
                                className="mt-2 p-2 text-black border rounded-md w-full"
                            />
                        </label>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => currentUnion && handleUpdateSubmit(currentUnion)}>
                            Update
                        </Button>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UnionShow;
