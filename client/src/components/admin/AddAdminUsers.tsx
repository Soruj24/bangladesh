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
import { Upload, Loader2, UserPlus, X } from "lucide-react";
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
  const divisionName = useSelector((state: RootState) => state.geo.divisionName);
  const districtName = useSelector((state: RootState) => state.geo.districtName);
  const upazilaName = useSelector((state: RootState) => state.geo.upazilaName);
  const unionName = useSelector((state: RootState) => state.geo.unionName);
  const villageName = useSelector((state: RootState) => state.geo.villageName);

  const placedPath = [divisionName, districtName, upazilaName, unionName, villageName].filter(Boolean);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div>
        <p className="eyebrow">Admin</p>
        <h1 className="page-title">Add Population User</h1>
        <p className="page-sub">Register a new person in three steps</p>
      </div>

      <Card className="border shadow-none">
        <CardContent className="p-5 sm:p-6">
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} encType="multipart/form-data">
              {/* 01 · Identity */}
              <section aria-labelledby="add-user-identity">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-xs tabular text-muted-foreground" aria-hidden="true">01</span>
                  <h2 id="add-user-identity" className="section-title">Identity</h2>
                </div>
                <p className="mb-5 mt-1 text-sm text-muted-foreground">
                  Photo, name and email — the only required fields.
                </p>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label={imagePreview ? "Change profile photo" : "Upload profile photo"}
                      aria-describedby="photo-hint"
                      className="group relative block rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Selected profile photo"
                          className="h-20 w-20 rounded-full object-cover ring-1 ring-border"
                        />
                      ) : (
                        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-input bg-muted transition-colors duration-150 group-hover:border-primary" aria-hidden="true">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </span>
                      )}
                    </button>
                    <div className="mt-2 text-center sm:text-left">
                      {imagePreview ? (
                        <button
                          type="button"
                          onClick={handleImageRemove}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors duration-150 hover:text-destructive"
                        >
                          <X className="h-3 w-3" aria-hidden="true" /> Remove
                        </button>
                      ) : (
                        <p id="photo-hint" className="text-xs text-muted-foreground">
                          Optional photo
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid flex-1 gap-4 sm:grid-cols-2">
                    <FormField control={formMethods.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name <span className="font-normal text-muted-foreground">(required)</span>
                        </FormLabel>
                        <FormControl><Input placeholder="e.g. Arif Rahman" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={formMethods.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <span className="font-normal text-muted-foreground">(required)</span>
                        </FormLabel>
                        <FormControl><Input placeholder="name@example.com" autoComplete="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </section>

              {/* 02 · Details */}
              <section aria-labelledby="add-user-details" className="mt-8 border-t pt-6">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-xs tabular text-muted-foreground" aria-hidden="true">02</span>
                  <h2 id="add-user-details" className="section-title">Details</h2>
                </div>
                <p className="mb-5 mt-1 text-sm text-muted-foreground">
                  All optional — anything here helps identify the record later.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField control={formMethods.control} name="tag" render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tag <span className="font-normal text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <FormControl><Input placeholder="e.g. household-head" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={formMethods.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone <span className="font-normal text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <FormControl><Input placeholder="e.g. 01XXXXXXXXX" inputMode="tel" autoComplete="tel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={formMethods.control} name="bio" render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>
                        Bio <span className="font-normal text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <FormControl><Textarea placeholder="A short note about this person…" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </section>

              {/* 03 · Placement */}
              <fieldset className="mt-8 min-w-0 border-t pt-6">
                <legend className="px-0">
                  <span className="flex items-baseline gap-2.5">
                    <span className="text-xs tabular text-muted-foreground" aria-hidden="true">03</span>
                    <span className="section-title">Placement</span>
                  </span>
                </legend>
                <p className="mb-5 mt-1 text-sm text-muted-foreground">
                  Work top to bottom — each level unlocks the next.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DivisionCombo />
                  <DistrictCombo />
                  <UpazilaCombo />
                  <UnionCombo />
                  <VillageCombo />
                </div>

                <p className="mt-4 border-t border-dashed pt-3.5 text-sm tabular" aria-live="polite">
                  {placedPath.length > 0 ? (
                    <span className="text-foreground">{placedPath.join("  ›  ")}</span>
                  ) : (
                    <span className="text-muted-foreground">Nothing placed yet</span>
                  )}
                </p>
              </fieldset>

              <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Adding…</>
                  ) : (
                    <><UserPlus className="mr-2 h-4 w-4" aria-hidden="true" /> Add User</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Name and email are required.
                </p>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAdminUsers;
