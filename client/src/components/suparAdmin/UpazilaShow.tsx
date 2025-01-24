import { useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  useDeleteUpozilaMutation,
  useGetAllUpazilasQuery,
  useUpdateUpozilaMutation,
} from "@/services/upozilaApi";

const UpazilaShow = () => {
    
  const { data, isError, isLoading, refetch } = useGetAllUpazilasQuery();
  const [updateUpozila] = useUpdateUpozilaMutation();
  const [deleteUpozila] = useDeleteUpozilaMutation();


  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDivision, setCurrentDivision] = useState<Upazila | null>(null);


  const handleDelete = async (id: string) => {
    const res = await deleteUpozila(id);
    console.log(res);

    if (res?.error) {
      toast({
        title: "Error",
        description:
          (res.error as { data?: { message?: string } })?.data?.message ||
          "Failed to update division",
        variant: "destructive",
      });
    }
    toast({
      title: "Success",
      description: "Division deleted successfully",
      variant: "default",
    });
    refetch();
  };


  const handleUpdate = (upazila: Upazila) => {
    setCurrentDivision(upazila);
    setIsDialogOpen(true);
  };


  interface Upazila {
    _id: number;
    name: string;
  }


  const handleUpdateSubmit = async (updatedDivision: Upazila) => {
    if (!updatedDivision?.name?.trim()) {
      toast({
        title: "Error",
        description: "Division name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await updateUpozila({
        ...updatedDivision,
        upazilaId: updatedDivision._id.toString(),
      }).unwrap();
      console.log("Update response:", res); // Debugging

      toast({
        title: "Success",
        description: "Division updated successfully",
        variant: "default",
      });

      refetch(); // Refresh divisions list
      setIsDialogOpen(false); // Close dialog
    } catch (error) {
      console.error("Update error:", error); // Debugging
      toast({
        title: "Error",
        description:
          (error as { data?: { message?: string } })?.data?.message ||
          "Failed to update division",
        variant: "destructive",
      });
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-6 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Dynamic Skeleton loaders based on number of divisions */}
        {[...Array(data?.UpazilaWithOutDistrict?.length || 1)].map((_, index) => (
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


  if (isError) {
    return <h1>Error</h1>;
  }

  return (
    <div className="mt-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data?.UpazilaWithOutDistrict?.map((upazila: Upazila) => {
        return (
          <Card key={upazila._id} className="max-w-xs p-4 border shadow-lg">
            <CardHeader>
              <h2 className="text-lg font-semibold">{upazila.name}</h2>
            </CardHeader>
            <CardContent>
              {/* Additional division content can go here */}
              <p>{upazila.name}</p>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Button onClick={() => handleDelete(upazila._id.toString())}>
                Delete
              </Button>
              <Button onClick={() => handleUpdate(upazila)}>Update</Button>
            </CardFooter>
          </Card>
        );
      })}

      {/* Dialog for updating the division */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update upazila</DialogTitle>
          </DialogHeader>
          {/* Add form fields for updating division here */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm  font-semibold">Division Name</span>
              <input
                type="text"
                value={currentDivision?.name || ""}
                onChange={(e) =>
                  setCurrentDivision({
                    ...currentDivision,
                    name: e.target.value,
                  })
                }
                className="mt-2 p-2 text-black border rounded-md w-full"
              />
            </label>
          </div>
          <DialogFooter>
            <Button onClick={() => handleUpdateSubmit(currentDivision)}>
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

export default UpazilaShow;
