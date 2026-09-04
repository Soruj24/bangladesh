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
import { Button } from "@/components/ui/button";
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

  const { data: upazilaData } = useGetUpazilasQuery(
    { divisionId, districtId },
    { skip: !divisionId || !districtId }
  );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const upazilaList = (upazilaData as { upazila?: { _id: string; name: string }[] })?.upazila || [];
  const selectedName = upazilaList.find((u) => u._id === value)?.name;

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium">Select Upazila</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value
              ? selectedName ?? "Select Upazila..."
              : "Select Upazila..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search upazila..." className="h-9" />
            <CommandList>
              <CommandEmpty>No upazila found.</CommandEmpty>
              <CommandGroup>
                {upazilaList.map((upazila) => (
                  <CommandItem
                    key={upazila._id}
                    value={upazila.name}
                    onSelect={() => {
                      setValue((prev) => (prev === upazila._id ? "" : upazila._id));
                      dispatch(setUpazilaId(upazila._id));
                      dispatch(setUpazilaName(upazila.name));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === upazila._id ? "opacity-100" : "opacity-0"
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
