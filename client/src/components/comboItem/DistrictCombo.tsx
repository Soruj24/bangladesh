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
import { useGetDistrictsQuery } from "@/services/districtApi";
import { setDistrictId, setDistrictName } from "@/features/geoSlice";
import { RootState } from "@/app/store";

const DistrictCombo = () => {
  const divisionId = useSelector(
    (state: RootState) => state.geo.divisionId
  );

  const { data: districtData } = useGetDistrictsQuery(divisionId, { skip: !divisionId });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const districtList = (districtData as unknown as { payload?: { district?: { _id: string; name: string }[] } })?.payload?.district ?? [];
  const selectedName = districtList.find((d) => d._id === value)?.name;

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium">Select District</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value
              ? selectedName ?? "Select District..."
              : "Select District..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search district..." className="h-9" />
            <CommandList>
              <CommandEmpty>No district found.</CommandEmpty>
              <CommandGroup>
                {districtList.map(
                  (district) => (
                    <CommandItem
                      key={district._id}
                      value={district.name}
                      onSelect={() => {
                        setValue((prev) => (prev === district._id ? "" : district._id));
                        dispatch(setDistrictId(district._id));
                        dispatch(setDistrictName(district.name));
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === district._id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {district.name}
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DistrictCombo;
