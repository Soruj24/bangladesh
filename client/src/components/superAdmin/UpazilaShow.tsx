import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useDeleteUpozilaMutation, useGetAllUpazilasQuery, useUpdateUpozilaMutation } from "@/services/upozilaApi";
import { Pencil, Trash2 } from "lucide-react";

const UpazilaShow = () => {
  const { data, isError, isLoading, refetch } = useGetAllUpazilasQuery();
  const [updateUpozila] = useUpdateUpozilaMutation();
  const [deleteUpozila] = useDeleteUpozilaMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [current, setCurrent] = useState<{ _id: string; name: string } | null>(null);

  const handleDelete = async (id: string) => {
    const res = await deleteUpozila(id);
    if (res?.error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Upazila deleted" });
    refetch();
  };

  const handleUpdateSubmit = async () => {
    if (!current || !current.name.trim()) {
      toast({ title: "Error", description: "Name cannot be empty", variant: "destructive" });
      return;
    }
    try {
      await updateUpozila({ upazilaId: current._id.toString(), name: current.name }).unwrap();
      toast({ title: "Success", description: "Upazila updated" });
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: (error as { data?: { message?: string } })?.data?.message || "Failed", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">Upazilas</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border bg-card shadow-none"><CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent className="p-5 pt-0"><Skeleton className="h-4 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Upazilas</h1>
      <Card className="border bg-card py-14 text-center shadow-none">
        <CardContent className="space-y-3 p-5">
          <p className="text-sm text-destructive">Failed to load upazilas</p>
          <Button onClick={refetch} variant="outline" size="sm">Retry</Button>
        </CardContent>
      </Card>
    </div>
  );

  const upazilas = data?.UpazilaWithOutDistrict || [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Upazilas</h1>
      {upazilas.length === 0 ? (
        <Card className="border bg-card py-14 text-center shadow-none">
          <CardContent className="p-5 text-sm text-muted-foreground">No upazilas found.</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {upazilas.map((upazila) => (
            <Card key={upazila._id || String(Math.random())} className="border bg-card shadow-none">
              <CardHeader className="pb-3">
                <h3 className="text-[15px] font-semibold tracking-tight">{upazila.name}</h3>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setCurrent({ _id: upazila._id || '', name: upazila.name }); setIsDialogOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(upazila._id || '')}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader><DialogTitle className="text-[15px] font-semibold tracking-tight">Update Upazila</DialogTitle><DialogDescription className="text-sm text-muted-foreground">Update the record name.</DialogDescription></DialogHeader>
          <Input className="h-10" value={current?.name || ""} onChange={(e) => setCurrent(prev => prev ? { ...prev, name: e.target.value } : null)} />
          <DialogFooter className="border-t bg-muted/40 px-5 py-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSubmit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpazilaShow;
