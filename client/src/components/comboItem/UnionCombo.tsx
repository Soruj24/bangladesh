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
import { RootState } from "@/app/store"; // Ensure your RootState is correctly imported
import { useGetUnionsQuery } from "@/services/unionsApi";
import { setUnionId } from "@/features/unionSlice";

const UnionCombo = () => {
  // Selectors for division, district, and upazila IDs
  const divisionId = useSelector(
    (state: RootState) => state.divisionIdData?.divisionId
  );
  const districtId = useSelector(
    (state: RootState) => state.districtIdData?.districtId
  );
  const upazilaId = useSelector(
    (state: RootState) => state.upazilaIdData?.upazilaId
  );

  const [open, setOpen] = useState<boolean>(false);
  const [selectedUnion, setSelectedUnion] = useState<string | null>(null); // State for selected union
  const dispatch = useDispatch();

  // Fetch union data
  const { data: unionData, isLoading: unionLoading } = useGetUnionsQuery({
    divisionId,
    districtId,
    upazilaId,
  });

  return (
    <div>
      <p className="text-sm my-4 font-medium leading-none">Select Union</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedUnion
              ? unionData?.unions?.find(
                  (union: { _id: string }) => union._id === selectedUnion
                )?.name
              : "Select union..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search union..." />
            <CommandList>
              {unionLoading ? (
                <p className="p-4 text-sm">Loading unions...</p>
              ) : unionData?.unions?.length ? (
                <CommandGroup>
                  {unionData.unions.map(
                    (union: { _id: string; name: string }) => (
                      <CommandItem
                        key={union._id}
                        value={union.name}
                        onSelect={() => {
                          setSelectedUnion(union._id); // Update state
                          dispatch(setUnionId(union._id)); // Dispatch Redux action
                          setOpen(false); // Close popover
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedUnion === union._id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {union.name}
                      </CommandItem>
                    )
                  )}
                </CommandGroup>
              ) : (
                <CommandEmpty>No unions found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UnionCombo;
