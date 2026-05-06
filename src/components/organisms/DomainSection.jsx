import { useEffect, useState } from "react";
import { Link, Globe, AlertTriangleIcon, Network, Dot, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useProjectProvider } from "@/hooks/useProjectProvider";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Spinner } from "../ui/spinner";
import { Badge } from "../ui/badge";
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

export default function DomainSection({ project_id, current_domain }) {
  const { 
    domainLoading, 
    FetchCustomDomain, 
    AddCustomDomainToProject, 
    DeleteCustomDomainFromProject 
  } = useProjectProvider();
  
  const [domain, setDomain] = useState({});
  const [disableAdd, setDisableAdd] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [step, setStep] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isValidDomain = (value) => {
    const domainRegex = /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(value.trim());
  };

  const getHostFromDomain = (domain) => {
    const parts = domain.split(".");
    if (parts.length <= 2) {
      return "@";
    }
    return parts.slice(0, -2).join(".");
  };

  const handleNext = () => {
    if (!isValidDomain(newDomain)) return;
    setStep(2);
  };

  const handleAddDomain = async () => {
    const data = await AddCustomDomainToProject(project_id, newDomain);
    if (data?.success) {
      setDomain(data?.data || {});
    }
    await fetchDomain();
  };

  const handleDeleteDomain = async () => {
    setIsDeleting(true);
    const data = await DeleteCustomDomainFromProject(project_id, domain.domainName);
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    
    if (data?.success) {
      setDomain({});
      setStep(1);
      setNewDomain("");
    }
  };

  const fetchDomain = async () => {
    const domain = await FetchCustomDomain(project_id);
    if (!domain?.success) return;
    setDomain(domain?.data || {});
  };

  useEffect(() => {
    if (!project_id) return;
    fetchDomain();
  }, [project_id]);

  useEffect(() => {
    if (isValidDomain(newDomain)) {
      setDisableAdd(false);
    } else {
      setDisableAdd(true);
    }
  }, [newDomain]);

  return (
    <>
      <div className="flex items-center space-x-4 p-4 border rounded-md">
        <Link />
        <div>
          <h2>Custom Domain</h2>
          <p className="text-xs text-gray-500">
            View and manage your custom domain settings and configurations
          </p>
        </div>
      </div>

      {domainLoading ? (
        <Spinner className="mx-auto mt-10 size-6" />
      ) : (
        <>
          {Object.keys(domain).length === 0 && (
            <div className="max-w-xl mt-5 mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <Globe className="mx-auto" />
                  <h3 className="text-lg font-semibold">
                    No domain added yet
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your domain to enable DNS management, SSL protection and much more.
                  </p>
                </CardHeader>

                <CardContent>
                  {step === 2 && (
                    <Alert className="mt-5 border-blue-200 bg-blue-50 text-blue-900 mb-5">
                      <AlertTitle>Configure DNS (CNAME)</AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">
                          Add the following CNAME record in your domain provider:
                        </p>

                        <div className="bg-white border rounded p-3 text-sm space-y-1">
                          <div>
                            <strong>Type:</strong> CNAME
                          </div>
                          <div>
                            <strong>Host:</strong> {getHostFromDomain(newDomain)}
                          </div>
                          <div>
                            <strong>Value:</strong> {current_domain}
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-muted-foreground">
                          DNS propagation can take up to 48 hours.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Field orientation="horizontal">
                    <Input
                      type="search"
                      placeholder="example.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value.trim())}
                      disabled={step === 2}
                    />

                    {step === 1 && (
                      <Button disabled={disableAdd} onClick={handleNext}>
                        Next
                      </Button>
                    )}

                    {step === 2 && (
                      <Button onClick={handleAddDomain}>
                        Add Domain
                      </Button>
                    )}
                  </Field>

                  <Alert className="mt-5 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                    <AlertTriangleIcon />
                    <AlertTitle>Enter a valid domain</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Use <span className="font-medium">example.com</span> or{" "}
                          <span className="font-medium">sub.example.com</span>
                        </li>
                        <li>
                          Do not include <span className="font-medium">http://</span> or{" "}
                          <span className="font-medium">https://</span>
                        </li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}

          {Object.keys(domain).length > 0 && (
            <Card className="max-w-xl mt-5 mx-auto">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Network />
                  <h3>Active Domain</h3>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex gap-2 items-stretch">
                  <Alert className="flex-1 border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50 flex items-center">
                    <Globe />
                    <AlertTitle className="mb-0 ml-2">{domain?.domainName}</AlertTitle>
                    <Badge variant={"outline"} className={"ml-auto text-xs"}>
                      <Dot /> {domain?.status}
                    </Badge>
                  </Alert>

                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="cursor-pointer text-red-500 h-auto"
                        aria-label="Delete custom domain"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={"sm:max-w-sm"}>
                      <DialogHeader>
                        <DialogTitle>Delete Custom Domain</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete the domain{" "}
                          <span className="font-semibold text-foreground">
                            {domain?.domainName}
                          </span>
                          ? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            className="cursor-pointer"
                            disabled={isDeleting}
                            onClick={() => setIsDeleteDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
                          onClick={handleDeleteDomain}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  );
}