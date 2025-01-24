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
import { setDivisionId, setDivisionName } from "@/features/divisionSlice";
import { useGetDivisionsQuery } from "@/services/dividionApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";

const DivisionCombo = () => {
  const { data: divisionData, isLoading } = useGetDivisionsQuery();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const dispatch = useDispatch();

  if (isLoading) {
    return <div>Loading...</div>;
  } 

  return (
    <div>
      <p className="text-sm my-4 font-medium leading-none">Select Division</p>
      <Popover open={open}  onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            {value
              ? divisionData?.divisions?.find(
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
                {divisionData?.divisions?.map(
                  (division: { _id: string; name: string; value: string }) => (
                    <CommandItem
                      key={division._id}
                      value={division.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        dispatch(setDivisionId(division._id));
                        dispatch(setDivisionName(division.name));
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

export default DivisionCombo;
