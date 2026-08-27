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
import { useGetVillagesQuery } from "@/services/villageApi";
import { setVillageId, setVillageName } from "@/features/geoSlice";
import { RootState } from "@/app/store";

const VillageCombo = () => {
  const divisionId = useSelector(
    (state: RootState) => state.geo.divisionId
  );
  const districtId = useSelector(
    (state: RootState) => state.geo.districtId
  );
  const upazilaId = useSelector(
    (state: RootState) => state.geo.upazilaId
  );
  const unionId = useSelector(
    (state: RootState) => state.geo.unionId
  );

  const { data: villageData } = useGetVillagesQuery({
    divisionId,
    districtId,
    upazilaId,
    unionId,
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  return (
    <div>
      <p className="text-sm my-4 font-medium leading-none">Select Village</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            {value
              ? villageData?.villages?.find(
                  (village: { value: string }) => village.value === value
                )?.label
              : "Select Village..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full">
          <Command>
            <CommandInput placeholder="Search village..." className="h-9" />
            <CommandList>
              <CommandEmpty>No village found.</CommandEmpty>
              <CommandGroup>
                {villageData?.villages?.map(
                  (village: { _id: string; name: string; value: string }) => (
                    <CommandItem
                      key={village._id}
                      value={village.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        dispatch(setVillageId(village._id));
                        dispatch(setVillageName(village.name));
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === village.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {village.name}
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

export default VillageCombo;
