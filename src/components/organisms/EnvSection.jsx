import { useProjectProvider } from "@/hooks/useProjectProvider";
import { useState, useEffect } from "react";
import { Copy, Check, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { errorToast, successToast } from "../atoms/Toast.Atom";

export default function EnvSection({ project_id }) {
  const { getProjectEnv, updateProjectEnv, addEnv, deleteEnv } =
    useProjectProvider();

  const [variables, setVariables] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variableToDelete, setVariableToDelete] = useState(null);

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

  useEffect(() => {
    if (!project_id) return;
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
      successToast("Environment variable updated");
    } catch (err) {
      console.error("Failed to update environment variable:", err);
      errorToast("Failed to update environment variable");
    } finally {
      setSavingId(null);
    }
  };

  const handleAdd = async (key, value) => {
    if (!project_id) return;
    if (!key || !value) return;
    try {
      setAddLoading(true);
      await addEnv(project_id, key, value);
      await fetchEnv();
      successToast("Environment variable added successfully");
      setNewKey("");
      setNewValue("");
    } catch (error) {
      console.error("Failed to add environment variable:", error);
      errorToast("Failed to add environment variable");
    } finally {
      setAddLoading(false);
      setIsAddDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!project_id || !variableToDelete) return;
    try {
      setDeletingId(variableToDelete.id);
      await deleteEnv(project_id, variableToDelete.key);
      setVariables((prev) => prev.filter((v) => v.id !== variableToDelete.id));
      successToast("Environment variable deleted successfully");
    } catch (error) {
      console.error("Failed to delete environment variable:", error);
      errorToast("Failed to delete environment variable");
    } finally {
      setDeletingId(null);
      setIsDeleteDialogOpen(false);
      setVariableToDelete(null);
    }
  };

  const openDeleteDialog = (variable) => {
    setVariableToDelete(variable);
    setIsDeleteDialogOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedValues({});
  };

  return (
    <>
      <div className="flex flex-col pb-8 space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
        <div>
          <h2>Environment Variables</h2>
          <p className="text-xs text-gray-500">
            View and manage your application environment variables
          </p>
        </div>
        <div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="cursor-pointer"
                onClick={() => setIsAddDialogOpen(true)}
              >
                + Add Variable
              </Button>
            </DialogTrigger>
            <DialogContent className={"sm:max-w-sm"}>
              <DialogHeader>
                <DialogTitle>Add Environment Variable</DialogTitle>
                <DialogDescription>
                  Add a new environment variable to your project. This variable
                  will be available to your application at runtime.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <Label htmlFor="key">Key</Label>
                  <Input
                    id="key"
                    name="key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value.toUpperCase())}
                  />
                </Field>

                <Field>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    name="value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  className={"cursor-pointer"}
                  onClick={() => handleAdd(newKey, newValue)}
                  disabled={addLoading}
                >
                  {addLoading ? "Adding..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className={"sm:max-w-sm"}>
              <DialogHeader>
                <DialogTitle>Delete Variable</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the environment variable{" "}
                  <span className="font-semibold text-foreground">
                    {variableToDelete?.key}
                  </span>
                  ? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => {
                      setIsDeleteDialogOpen(false);
                      setVariableToDelete(null);
                    }}
                    disabled={deletingId !== null}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDelete}
                  disabled={deletingId !== null}
                >
                  {deletingId !== null ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
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
                onClick={() => openDeleteDialog(variable)}
                aria-label="Delete variable"
                className={"cursor-pointer text-red-500"}
              >
                <Trash2 className="h-4 w-4" />
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