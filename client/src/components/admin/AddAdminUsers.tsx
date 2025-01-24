import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { Textarea } from "../ui/textarea";
import { useAddPopulationMutation } from "@/services/populationApi";
import { toast } from "@/hooks/use-toast";

import DivisionCombo from "../comboItem/DivisionCombo";
import DistrictCombo from "../comboItem/DistrictCombo";
import UpazilaCombo from "../comboItem/UpazilaCombo";
import UnionCombo from "../comboItem/UnionCombo";
import VillageCombo from "../comboItem/VillageCombo";
import { useSelector } from "react-redux";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().optional(),
  tag: z.string().optional(),
  phone: z.string().optional(),
});

const AddAdminUsers = () => {
  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", bio: "", tag: "", phone: "" },
  });

  const [addPopulation] = useAddPopulationMutation();


const divisionId = useSelector(
  (state: { divisionIdData: { divisionId: string } }) => state?.divisionIdData?.divisionId
);

const districtId = useSelector(
  (state: { districtIdData: { districtId: string } }) => state?.districtIdData?.districtId
);

const upazilaId = useSelector(
  (state: { upazilaIdData: { upazilaId: string } }) => state?.upazilaIdData?.upazilaId
);

const unionId = useSelector(
  (state: { unionIdData: { unionId: string } }) => state?.unionIdData?.unionId
);

const villageId = useSelector(
  (state: { villageIdData: { villageId: string } }) => state?.villageIdData?.villageId
);

 

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const newPopulation = {
        ...data,
       division:  divisionId,
       district:  districtId,
        upazila:  upazilaId,
        union:  unionId,
        village:  villageId,
      };

      const res = await addPopulation(newPopulation);

      if (res.error) {
        toast({
          title: "Error",
          description: res?.error?.data?.message,
          variant: "destructive",
        });
        return;
      }

      console.log(res);
      toast({
        title: " Success",
        description: "Admin User Added Successfully",
        variant: "default",
      });
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
      <Card className="p-4 shadow-lg">
        <CardContent>
          <CardTitle className="text-2xl font-semibold text-center mb-6">
            Add Admin User
          </CardTitle>
          <FormProvider {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter name"
                          {...field}
                          className="py-2 px-4 border rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email"
                          {...field}
                          className="py-2 px-4 border rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Tag"
                          {...field}
                          className="py-2 px-4 border rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Bio"
                          {...field}
                          className="py-2 px-4 border rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Phone"
                          {...field}
                          className="py-2 px-4 border rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 justify-center items-center">
                <DivisionCombo />
                <DistrictCombo />
                <UpazilaCombo />
                <UnionCombo />
                <VillageCombo />
              </div>

              <Button type="submit" className="w-full md:w-auto">
                Submit
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAdminUsers;
