import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAddPopulationMutation } from "@/services/populationApi";
import { toast } from "@/hooks/use-toast";
import DivisionCombo from "../comboItem/DivisionCombo";
import DistrictCombo from "../comboItem/DistrictCombo";
import UpazilaCombo from "../comboItem/UpazilaCombo";
import UnionCombo from "../comboItem/UnionCombo";
import VillageCombo from "../comboItem/VillageCombo";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Upload, Loader2, UserPlus } from "lucide-react";
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().optional(),
  tag: z.string().optional(),
  phone: z.string().optional(),
});

const AddAdminUsers = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", bio: "", tag: "", phone: "" },
  });

  const [addPopulation, { isLoading }] = useAddPopulationMutation();

  const divisionId = useSelector((state: RootState) => state.geo.divisionId);
  const districtId = useSelector((state: RootState) => state.geo.districtId);
  const upazilaId = useSelector((state: RootState) => state.geo.upazilaId);
  const unionId = useSelector((state: RootState) => state.geo.unionId);
  const villageId = useSelector((state: RootState) => state.geo.villageId);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: { name: string; email: string; bio?: string; tag?: string; phone?: string }) => {
    try {
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "image_upload");
        formData.append("cloud_name", "dlg03uemw");
        const resp = await axios.post("https://api.cloudinary.com/v1_1/dlg03uemw/image/upload", formData);
        imageUrl = resp.data.secure_url;
      }

      const newPopulation = {
        ...data,
        division: divisionId,
        district: districtId,
        upazila: upazilaId,
        union: unionId,
        village: villageId,
        image: imageUrl,
      };

      const res = await addPopulation(newPopulation);
      if (res.error) {
        toast({
          title: "Error",
          description: "data" in res.error ? (res.error.data as { message: string }).message : "An error occurred",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Success", description: "Population user added successfully" });
      formMethods.reset();
      setImage(null);
      setImagePreview(null);
    } catch {
      toast({ title: "Error", description: "Failed to add user", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Population User</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Register a new person in the system</p>
      </div>

      <Card className="border-0 shadow-sm dark:bg-gray-900/50">
        <CardContent className="pt-6">
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
              <div className="flex flex-col items-center">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="relative group">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-emerald-500 transition-colors">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </button>
                <p className="text-sm text-gray-500 mt-2">Click to upload photo</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="Enter name" {...field} className="h-10" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="Enter email" {...field} className="h-10" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="tag" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <FormControl><Input placeholder="Enter tag" {...field} className="h-10" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input placeholder="Enter phone" {...field} className="h-10" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="bio" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Bio</FormLabel>
                    <FormControl><Textarea placeholder="Enter bio" {...field} className="min-h-[80px]" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DivisionCombo />
                <DistrictCombo />
                <UpazilaCombo />
                <UnionCombo />
                <VillageCombo />
              </div>

              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                ) : (
                  <><UserPlus className="mr-2 h-4 w-4" /> Add User</>
                )}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAdminUsers;
