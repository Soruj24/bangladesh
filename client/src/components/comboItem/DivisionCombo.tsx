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
import { setDivisionId, setDivisionName } from "@/features/geoSlice";
import { useGetDivisionsQuery } from "@/services/dividionApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";

const DivisionCombo = () => {
  const { data: divisionData, isLoading } = useGetDivisionsQuery();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const divisions = (divisionData as unknown as { payload?: { divisions?: { _id: string; name: string }[] } })?.payload?.divisions ?? [];
  const selectedName = divisions.find((d) => d._id === value)?.name;

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium">Select Division</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value
              ? selectedName ?? "Select Division..."
              : "Select Division..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search division..." className="h-9" />
            <CommandList>
              <CommandEmpty>No division found.</CommandEmpty>
              <CommandGroup>
                {divisions.map((division) => (
                  <CommandItem
                    key={division._id}
                    value={division.name}
                    onSelect={() => {
                      setValue((prev) => (prev === division._id ? "" : division._id));
                      dispatch(setDivisionId(division._id));
                      dispatch(setDivisionName(division.name));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === division._id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {division.name}
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

export default DivisionCombo;
