import { Table } from "lucide-react";
import { Database } from "lucide-react";
import { Card } from "../ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";
import { useState } from "react";
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item";
import { useProjectProvider } from "@/hooks/useProjectProvider";
import { useEffect } from "react";
import { Separator } from "../ui/separator";

export default function DatabaseSection({ project_id }) {
  const { fetchProjectContainers } = useProjectProvider();

  const [containers, setContainers] = useState([]);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");

  const filteredContainers = containers.filter((container) =>
    container.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (!project_id) return;

    const fetchContainers = async () => {
      try {
        const data = await fetchProjectContainers(project_id);
        if (data?.success) {
          setContainers(data?.data?.containers || []);
          data?.data?.containers?.length > 0 &&
            setSelected(data?.data?.containers[0]);
        }
      } catch (error) {
        console.error("Error fetching project containers:", error);
      }
    };

    fetchContainers();
  }, [project_id]);

  return (
    <>
      <div className="flex items-center space-x-4 p-4 border rounded-md">
        <Database className="" />
        <div className="">
          <h2>Database Explorer</h2>
          <p className="text-xs text-gray-500">
            View and manage your database tables and data
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6 flex-1">
        <Card className={"rounded-md p-3 col-span-4"}>
          <div className="">
            <div className="flex items-center space-x-2">
              <Table size={18} />
              <h3 className="mb-0 pb-0">Tables</h3>
            </div>

            <div className="mt-4">
              <InputGroup className="max-w-xs">
                <InputGroupInput
                  placeholder="Search Tables..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  {filteredContainers.length} results
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="mt-4">
              {filteredContainers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No tables found.
                </p>
              ) : (
                <>
                  {filteredContainers.map((container, index) => {
                    const isSelected = selected === container;

                    return (
                      <div key={index}>
                        <Item
                          variant={isSelected ? "muted" : ""}
                          className="p-2 cursor-pointer mb-2 mt-2"
                          onClick={() => setSelected(container)}
                        >
                          <ItemMedia variant="icon">
                            <Table />
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle>{container}</ItemTitle>
                          </ItemContent>
                        </Item>

                        {index !== filteredContainers.length - 1 && (
                          <Separator />
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </Card>

        <Card className={"rounded-md p-3 col-span-8"}>
          <div>
            <div className="flex items-center space-x-2">
              <Table size={18} />
              <h3 className="mb-0 pb-0">{selected || "Select a Table"}</h3>
            </div>

            <div className="mt-4 min-h-[300px]"  >

            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
