import { useState } from "react";
import { useGetDivisionsQuery, useDeleteDivisionMutation, useUpdateDivisionMutation } from "@/services/dividionApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, Globe, Loader2, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const DivisionShow = () => {
  const { data, isError, isLoading, refetch } = useGetDivisionsQuery();
  const [deleteDivision] = useDeleteDivisionMutation();
  const [updateDivision, { isLoading: isUpdating }] = useUpdateDivisionMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDivision, setCurrentDivision] = useState<{ _id: string; name: string } | null>(null);

  const divisions = (data as unknown as { payload?: { divisions?: { _id: string; name: string }[] } })?.payload?.divisions ?? [];

  const handleDelete = async (id: string) => {
    const res = await deleteDivision(id);
    if (res.error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
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
      await updateDivision({ id: currentDivision._id, name: currentDivision.name }).unwrap();
      toast({ title: "Success", description: "Division updated" });
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: (error as { data?: { message?: string } })?.data?.message || "Failed to update", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div>
          <p className="eyebrow">Geography</p>
          <h1 className="page-title">Divisions</h1>
          <p className="page-sub">Loading records…</p>
        </div>
        <Card className="overflow-hidden border bg-card shadow-none" aria-label="Loading divisions">
          <CardContent className="p-0" aria-busy="true">
            <ul className="divide-y divide-border">
              {[...Array(6)].map((_, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <Skeleton className="h-3.5 w-7 shrink-0" />
                  <Skeleton className="h-4 w-40" />
                  <div className="ml-auto hidden shrink-0 gap-2 sm:flex">
                    <Skeleton className="h-9 w-[76px]" />
                    <Skeleton className="h-9 w-[92px]" />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-5">
        <div>
          <p className="eyebrow">Geography</p>
          <h1 className="page-title">Divisions</h1>
          <p className="page-sub">Couldn&apos;t load records</p>
        </div>
        <Card className="border bg-card shadow-none">
          <CardContent className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3.5">
              <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
            </div>
            <h2 className="section-title">Failed to load divisions</h2>
            <p className="mb-5 mt-1 max-w-sm text-sm text-muted-foreground">
              Check your connection and try again.
            </p>
            <Button onClick={refetch} variant="outline" size="sm">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="eyebrow">Geography</p>
          <h1 className="page-title">Divisions</h1>
          <p className="page-sub tabular" aria-live="polite">
            {divisions.length} {divisions.length === 1 ? "record" : "records"}
          </p>
        </div>
      </div>

      {divisions.length === 0 ? (
        <Card className="border bg-card shadow-none">
          <CardContent className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="mb-4 rounded-full bg-muted p-3.5">
              <Globe className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            </div>
            <h2 className="section-title">No divisions yet</h2>
            <p className="mb-5 mt-1 max-w-sm text-sm text-muted-foreground">
              Create the first division from the Create Items page.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard/super-admin/create">Go to Create Items</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border bg-card shadow-none">
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {divisions.map((division, index) => (
                <li key={division._id} className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
                  <span className="w-7 shrink-0 text-xs tabular text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {division.name}
                  </span>
                  <span className="ml-auto flex shrink-0 gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => { setCurrentDivision(division); setIsDialogOpen(true); }} aria-label={`Edit ${division.name}`}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(division._id)}
                      aria-label={`Delete ${division.name}`}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form
            onSubmit={(e) => { e.preventDefault(); handleUpdateSubmit(); }}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle className="section-title">Update Division</DialogTitle>
              <DialogDescription>Update the record name.</DialogDescription>
            </DialogHeader>
            <div className="space-y-1.5">
              <Label htmlFor="edit-division-name">Name</Label>
              <Input
                id="edit-division-name"
                className="h-10"
                value={currentDivision?.name || ""}
                onChange={(e) => setCurrentDivision(prev => prev ? { ...prev, name: e.target.value } : null)}
              />
            </div>
            <DialogFooter className="border-t bg-muted/40 px-5 py-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Updating…</>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DivisionShow;
