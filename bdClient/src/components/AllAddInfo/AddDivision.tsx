import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useAddDivisionMutation } from "@/services/divisionApi";

const divisionSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name last 3 characters" })
    .max(20, { message: "Name cannot exceed 20 characters" }),
});

type DivisionFormValues = z.infer<typeof divisionSchema>;

export function AddDivision() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DivisionFormValues>({
    resolver: zodResolver(divisionSchema),
  });

  const [addDivision] = useAddDivisionMutation()

  const onSubmit = async (data: DivisionFormValues) => {

    try {
      const res = await addDivision(data)

      if (res.error) {
        return toast({
          title: "division not create",

        })
      } else {
        return toast({
          title: data.name + " Add Successfully",
        })
      }




    } catch (error) {
      console.log(error)
    }

  };

  return (
    <Card className=" ">
      <CardHeader>
        <CardTitle>Add Division</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Name of your project"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Add Division
        </Button>
      </CardFooter>
    </Card>
  );
}
