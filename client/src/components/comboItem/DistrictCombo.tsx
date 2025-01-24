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
import { useGetDistrictsQuery } from "@/services/districtApi";
import RootState from "@/app/action";
import { setDistrictId, setDistrictName } from "@/features/districtSlice";

const DistrictCombo = () => {
  const divisionId = useSelector(
    (state: RootState) => state?.divisionIdData?.divisionId
  );

  const { data: districtData } = useGetDistrictsQuery(divisionId);

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const dispatch = useDispatch();

  return (
    <div>
      <p className="text-sm my-3 font-medium leading-none">Select District</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            {value
              ? districtData?.division?.districts?.find(
                  (division: { value: string }) => division.value === value
                )?.label
              : "Select Division..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full">
          <Command>
            <CommandInput placeholder="Search division..." className="h-9" />
            <CommandList>
              <CommandEmpty>No division found.</CommandEmpty>
              <CommandGroup>
                {districtData?.division?.districts?.map(
                  (division: { _id: string; name: string; value: string }) => (
                    <CommandItem
                      key={division._id}
                      value={division.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        dispatch(setDistrictId(division._id));
                        dispatch(setDistrictName(division.name));
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === division.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {division.name}
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
