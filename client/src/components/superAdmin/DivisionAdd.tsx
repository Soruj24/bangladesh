import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAddDivisionMutation } from "@/services/dividionApi";
import { Loader2 } from "lucide-react";

const divisionSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

type DivisionFormData = z.infer<typeof divisionSchema>;

const DivisionAdd = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DivisionFormData>({
    resolver: zodResolver(divisionSchema),
  });

  const [addDivision, { isLoading }] = useAddDivisionMutation();

  const onSubmit = async (data: DivisionFormData) => {
    const res = await addDivision(data);
    if (res.error) {
      toast({
        title: "Error",
        description: "data" in res.error ? (res.error.data as { message: string }).message : "An error occurred",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Success", description: `Division "${data.name}" created` });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="div-name">Name</Label>
        <Input id="div-name" placeholder="e.g. Dhaka" autoComplete="off" {...register("name")} />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full shrink-0 sm:w-auto">
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Creating…</>
        ) : (
          "Create Division"
        )}
      </Button>
    </form>
  );
};

export default DivisionAdd;
