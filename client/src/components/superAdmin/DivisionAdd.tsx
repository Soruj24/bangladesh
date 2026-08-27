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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <Label htmlFor="div-name" className="text-sm">Name</Label>
        <Input id="div-name" placeholder="e.g. Dhaka" {...register("name")} className="mt-1 h-10" />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>
      <Button type="submit" size="sm" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Division"}
      </Button>
    </form>
  );
};

export default DivisionAdd;
