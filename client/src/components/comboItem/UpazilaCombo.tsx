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
import { setUpazilaId, setUpazilaName } from "@/features/geoSlice";
import { RootState } from "@/app/store";

const UpazilaCombo = () => {
  const divisionId = useSelector(
    (state: RootState) => state.geo.divisionId
  );
  const districtId = useSelector(
    (state: RootState) => state.geo.districtId
  );

  const { data: upazilaData } = useGetUpazilasQuery({
    divisionId,
    districtId,
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const upazilaList = (upazilaData as { upazila?: { _id: string; name: string; value: string; label: string }[] })?.upazila || [];

  return (
    <div>
      <p className="text-sm font-medium leading-none">Select Upazila</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            {value
              ? upazilaList.find((u) => u.value === value)?.label
              : "Select Upazila..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full">
          <Command>
            <CommandInput placeholder="Search upazila..." className="h-9" />
            <CommandList>
              <CommandEmpty>No upazila found.</CommandEmpty>
              <CommandGroup>
                {upazilaList.map((upazila) => (
                  <CommandItem
                    key={upazila._id}
                    value={upazila.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      dispatch(setUpazilaId(upazila._id));
                      dispatch(setUpazilaName(upazila.name));
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
