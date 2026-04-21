import { useProjectProvider } from "@/hooks/useProjectProvider";
import { useState, useEffect } from "react";
import { Copy, Check, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnvSection({ project_id }) {
  const { getProjectEnv, updateProjectEnv } = useProjectProvider();

  const [variables, setVariables] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!project_id) return;

    const fetchEnv = async () => {
      const data = await getProjectEnv(project_id);
      if (!data?.success) return;

      const formattedEnv = Object.entries(data?.data || {}).map(
        ([key, value]) => ({
          id: key,
          key,
          value,
        }),
      );

      setVariables(formattedEnv);
    };

    fetchEnv();
  }, [project_id]);

  const copyToClipboard = async (id, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const startEdit = (id, value) => {
    setEditingId(id);
    setEditedValues({ ...editedValues, [id]: value });
  };

  const saveEdit = async (id) => {
    if (!project_id) return;

    const targetVariable = variables.find((v) => v.id === id);
    if (!targetVariable) return;

    const nextValue = editedValues[id] ?? targetVariable.value;

    try {
      setSavingId(id);

      await updateProjectEnv(project_id, {
        key: targetVariable.key,
        value: nextValue,
      });

      const updated = variables.map((v) =>
        v.id === id ? { ...v, value: nextValue } : v,
      );

      setVariables(updated);
      setEditingId(null);
      setEditedValues((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error("Failed to update environment variable:", err);
    } finally {
      setSavingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedValues({});
  };

  return (
    <>
      <h2>Environment Variables</h2>
      <p className="text-xs text-gray-500 pb-8">
        View and manage your application environment variables
      </p>

      {variables.map((variable) => (
        <div
          key={variable.id}
          className="border rounded-md p-3 mb-3 flex justify-between items-start"
        >
          <div className="flex-1">
            <div className="text-sm font-semibold">{variable.key}</div>

            {editingId === variable.id ? (
              <div className="flex gap-2 mt-1">
                <input
                  className="border px-2 py-1 text-sm w-full"
                  value={editedValues[variable.id] ?? variable.value}
                  onChange={(e) =>
                    setEditedValues({
                      ...editedValues,
                      [variable.id]: e.target.value,
                    })
                  }
                  autoFocus
                />
                <Button
                  size="sm"
                  className={"cursor-pointer"}
                  onClick={() => saveEdit(variable.id)}
                  disabled={savingId === variable.id}
                >
                  {savingId === variable.id ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={"cursor-pointer"}
                  onClick={cancelEdit}
                  disabled={savingId === variable.id}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="text-xs text-gray-500 break-all mt-1">
                {variable.value}
              </div>
            )}
          </div>

          {editingId !== variable.id && (
            <div className="flex gap-2 ml-3">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => startEdit(variable.id, variable.value)}
                aria-label="Edit variable"
                className={"cursor-pointer"}
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard(variable.id, variable.value)}
                aria-label="Copy variable"
                className={"cursor-pointer"}
              >
                {copiedId === variable.id ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
