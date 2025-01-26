import { useState } from "react"
import { useGetDivisionsQuery, useDeleteDivisionMutation, useUpdateDivisionMutation, Division } from "@/services/dividionApi"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { toast } from "@/hooks/use-toast"

const DivisionShow = () => {
    const { data, isError, isLoading, refetch } = useGetDivisionsQuery()
    const [deleteDivision] = useDeleteDivisionMutation()
    const [updateDivision] = useUpdateDivisionMutation()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentDivision, setCurrentDivision] = useState<Division | null>(null)

    const handleDelete = async (id: number) => {
        const res = await deleteDivision(id)

        if (res.error) {
            toast({
                title: "Error",
                description: res?.error?.data?.message,
                variant: "destructive",
            })
        }
        toast({
            title: 'Success',
            description: 'Division deleted successfully',
            variant: 'default',
        })
        
        refetch()
    }

    const handleUpdate = (division: Division) => {
        setCurrentDivision(division)
        setIsDialogOpen(true)
    }

    const handleUpdateSubmit = async (updatedDivision: Division | null) => {
        if (!updatedDivision || !updatedDivision.name.trim()) {
            toast({
                title: "Error",
                description: "Division name cannot be empty",
                variant: "destructive",
            });
            return;
        }

        try {
            const res = await updateDivision({ ...updatedDivision, id: updatedDivision.id }).unwrap();

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
        )
    }

    if (isError) {
        return (
            <div className="text-center">
                <h1 className="text-red-600">Failed to fetch divisions.</h1>
                <Button onClick={refetch} variant="outline">Retry</Button>
            </div>
        )
    }

    return (
        <div className="mt-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.divisions.map((division) => (
                <Card key={division.id} className="max-w-xs p-4 border shadow-lg">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{division.name}</h2>
                    </CardHeader>
                    <CardContent>
                        <p>{division.name}</p>
                    </CardContent>
                    <CardFooter className="flex space-x-2">
                        <Button onClick={() => handleDelete(division.id)}>Delete</Button>
                        <Button onClick={() => handleUpdate(division)}>Update</Button>
                    </CardFooter>
                </Card>
            ))}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateSubmit(currentDivision);
                    }}
                >
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
                                        setCurrentDivision((prev) =>
                                            prev ? { ...prev, name: e.target.value } : null
                                        )
                                    }
                                    className="mt-2 p-2 text-black border rounded-md w-full"
                                    required
                                />
                            </label>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Update</Button>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </div>
    )
}

export default DivisionShow;
