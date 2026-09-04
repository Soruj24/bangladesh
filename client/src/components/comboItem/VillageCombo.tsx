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

  const { data: villageData } = useGetVillagesQuery(
    { divisionId, districtId, upazilaId, unionId },
    { skip: !divisionId || !districtId || !upazilaId || !unionId }
  );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const villageList = (villageData as { villages?: { _id: string; name: string }[] })?.villages || [];
  const selectedName = villageList.find((v) => v._id === value)?.name;

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium">Select Village</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value
              ? selectedName ?? "Select Village..."
              : "Select Village..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search village..." className="h-9" />
            <CommandList>
              <CommandEmpty>No village found.</CommandEmpty>
              <CommandGroup>
                {villageList.map(
                  (village) => (
                    <CommandItem
                      key={village._id}
                      value={village.name}
                      onSelect={() => {
                        setValue((prev) => (prev === village._id ? "" : village._id));
                        dispatch(setVillageId(village._id));
                        dispatch(setVillageName(village.name));
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === village._id ? "opacity-100" : "opacity-0"
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
