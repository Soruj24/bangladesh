import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useDeleteDistrictMutation, useGetAllDistrictsQuery, useUpdateDistrictMutation } from "@/services/districtApi";
import { Pencil, Trash2 } from "lucide-react";

const DistrictShow = () => {
  const { data, error, isLoading, refetch } = useGetAllDistrictsQuery();
  const [updateDistrict] = useUpdateDistrictMutation();
  const [deleteDistrict] = useDeleteDistrictMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [current, setCurrent] = useState<{ id: string; name: string } | null>(null);

  const handleDelete = async (id: string) => {
    const res = await deleteDistrict({ districtId: id });
    if (res?.error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "District deleted" });
    refetch();
  };

  const handleUpdateSubmit = async () => {
    if (!current || !current.name.trim()) {
      toast({ title: "Error", description: "Name cannot be empty", variant: "destructive" });
      return;
    }
    try {
      await updateDistrict({ districtId: current.id, name: current.name }).unwrap();
      toast({ title: "Success", description: "District updated" });
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: (error as { data?: { message?: string } })?.data?.message || "Failed", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-sm"><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  if (error) return <div className="text-center py-12 text-red-500">Failed to load districts</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Districts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.district?.map((district: { id: string; name: string }) => (
          <Card key={district.id} className="border-0 shadow-sm dark:bg-gray-900/50">
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">{district.name}</h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setCurrent({ id: district.id, name: district.name }); setIsDialogOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(district.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update District</DialogTitle></DialogHeader>
          <Input value={current?.name || ""} onChange={(e) => setCurrent(prev => prev ? { ...prev, name: e.target.value } : null)} />
          <DialogFooter>
            <Button onClick={handleUpdateSubmit}>Update</Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DistrictShow;
