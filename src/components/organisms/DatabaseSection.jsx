import { Table as TableIcon } from "lucide-react";
import { Database } from "lucide-react";
import { Card } from "../ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item";
import { useProjectProvider } from "@/hooks/useProjectProvider";
import { Separator } from "../ui/separator";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

export default function DatabaseSection({ project_id }) {
  const { fetchProjectContainers, fetchProjectItems } = useProjectProvider();

  const [containers, setContainers] = useState([]);
  const [items, setItems] = useState([]);
  const [continuationToken, setContinuationToken] = useState(null);
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
          const list = data?.data?.containers || [];
          setContainers(list);
          if (list.length > 0) {
            setSelected(list[0]);
            fetchItems(project_id, list[0]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchContainers();
  }, [project_id]);

  const fetchItems = async (project_id, container_id) => {
    try {
      const data = await fetchProjectItems(
        project_id,
        container_id,
        continuationToken,
      );
      if (data?.success) {
        setItems(data?.data?.items || []);
        setContinuationToken(data?.data?.continuationToken || null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4 p-4 border rounded-md">
        <Database />
        <div>
          <h2>Database Explorer</h2>
          <p className="text-xs text-gray-500">
            View and manage your database tables and data
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 flex-1">
        <Card className="rounded-md p-3 md:col-span-4 w-full">
          <div>
            <div className="flex items-center space-x-2">
              <TableIcon size={18} />
              <h3>Tables</h3>
            </div>

            <div className="mt-4">
              <InputGroup className="w-full">
                <InputGroupInput
                  placeholder="Search Tables..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  {filteredContainers.length}
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="mt-4 max-h-[300px] md:max-h-[500px] overflow-y-auto">
              {filteredContainers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No tables found.
                </p>
              ) : (
                filteredContainers.map((container, index) => {
                  const isSelected = selected === container;

                  return (
                    <div key={index}>
                      <Item
                        variant={isSelected ? "muted" : ""}
                        className="p-2 cursor-pointer my-2"
                        onClick={() => {
                          setSelected(container);
                          setContinuationToken(null);
                          fetchItems(project_id, container);
                        }}
                      >
                        <ItemMedia variant="icon">
                          <TableIcon />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="truncate">
                            {container}
                          </ItemTitle>
                        </ItemContent>
                      </Item>

                      {index !== filteredContainers.length - 1 && (
                        <Separator />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Card>

        <Card className="rounded-md p-3 md:col-span-8 w-full">
          <div>
            <div className="flex items-center space-x-2">
              <TableIcon size={18} />
              <h3 className="truncate">
                {selected || "Select a Table"}
              </h3>
            </div>

            <div className="mt-4 min-h-[250px] md:min-h-[300px] overflow-x-auto">
              {selected ? (
                items.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No data found in this table.
                  </p>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <Table className="min-w-[600px]">
                      <TableBody>
                        {items.map((item, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-100 cursor-pointer"
                          >
                            {Object.keys(item)
                              .filter(
                                (key) =>
                                  ![
                                    "_rid",
                                    "_self",
                                    "_etag",
                                    "_attachments",
                                    "_ts",
                                    "updatedAt",
                                  ].includes(key),
                              )
                              .map((key, idx) => (
                                <TableCell
                                  key={idx}
                                  className="whitespace-nowrap text-sm"
                                >
                                  {item[key]}
                                </TableCell>
                              ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  Select a table to view its data.
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}