import { useState } from "react";
import { useGetDivisionsQuery, useDeleteDivisionMutation, useUpdateDivisionMutation, Division } from "@/services/dividionApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Loader2 } from "lucide-react";

const DivisionShow = () => {
  const { data, isError, isLoading, refetch } = useGetDivisionsQuery();
  const [deleteDivision] = useDeleteDivisionMutation();
  const [updateDivision] = useUpdateDivisionMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDivision, setCurrentDivision] = useState<Division | null>(null);

  const handleDelete = async (id: number) => {
    const res = await deleteDivision(id);
    if (res.error) {
      toast({ title: "Error", description: res?.error?.data?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Division deleted" });
    refetch();
  };

  const handleUpdateSubmit = async () => {
    if (!currentDivision || !currentDivision.name.trim()) {
      toast({ title: "Error", description: "Name cannot be empty", variant: "destructive" });
      return;
    }
    try {
      await updateDivision({ ...currentDivision, id: currentDivision.id }).unwrap();
      toast({ title: "Success", description: "Division updated" });
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: (error as { data?: { message?: string } })?.data?.message || "Failed to update", variant: "destructive" });
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

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-3">Failed to load divisions</p>
        <Button onClick={refetch} variant="outline" size="sm">Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Divisions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.divisions?.map((division) => (
          <Card key={division.id} className="border-0 shadow-sm dark:bg-gray-900/50">
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">{division.name}</h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setCurrentDivision(division); setIsDialogOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(division.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Division</DialogTitle></DialogHeader>
          <Input value={currentDivision?.name || ""} onChange={(e) => setCurrentDivision(prev => prev ? { ...prev, name: e.target.value } : null)} />
          <DialogFooter>
            <Button onClick={handleUpdateSubmit}>Update</Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DivisionShow;
