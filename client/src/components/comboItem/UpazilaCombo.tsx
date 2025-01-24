import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { useGetUpazilasQuery } from "@/services/upozilaApi";
import { setUpazilaId } from "@/features/upazilaSlice";


const UpazilaCombo = () => {

   // Selectors to get IDs from Redux
  const divisionId = useSelector(
    (state: { divisionIdData: { divisionId: string } }) =>
      state?.divisionIdData?.divisionId
  );
  
  const districtId = useSelector(
    (state: { districtIdData: { districtId: string } }) =>
      state?.districtIdData?.districtId
  );

   
  const { data: upazilaData } = useGetUpazilasQuery({
    divisionId,
    districtId,
  });

  console.log("divisionId", divisionId, "districtId", districtId);

  console.log(upazilaData);

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const dispatch = useDispatch();

  return (
    <div>
      <p className="text-sm font-medium leading-none">Select Upazila</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {value
              ? upazilaData?.upazila?.find(
                  (upazila: { value: string; label: string }) =>
                    upazila.value === value
                )?.label
              : "Select Division..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search division..." className="h-9" />
            <CommandList>
              <CommandEmpty>No division found.</CommandEmpty>
              <CommandGroup>
                {upazilaData?.upazila?.map((upazila: { _id: string; name: string; value: string; label: string }) => (
                  <CommandItem
                    key={upazila._id}
                    value={upazila.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      dispatch(setUpazilaId(upazila._id));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === upazila.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {upazila.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UpazilaCombo;
