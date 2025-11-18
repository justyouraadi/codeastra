import React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { Calendar } from "lucide-react"

export default function GenerateKeyModal({
  open,
  onClose,
  onSubmit,
  keyName,
  accessType,
  usageLimit,
  expirationDate,
  allowedIPs,
  onChange,
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Generate New API Key</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage secure keys for your integrations.
          </p>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Key Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="keyName">Key Name</Label>
            <Input
              id="keyName"
              placeholder="e.g., Production Key"
              value={keyName}
              onChange={(e) => onChange("keyName", e.target.value)}
            />
          </div>

          {/* Access Type */}
          <div className="grid gap-1.5">
            <Label>Access Type</Label>
            <Select onValueChange={(val) => onChange("accessType", val)} value={accessType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Access Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="read">Read Only</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Usage Limit */}
          <div className="grid gap-1.5">
            <Label>Usage Limit</Label>
            <Select onValueChange={(val) => onChange("usageLimit", val)} value={usageLimit}>
              <SelectTrigger>
                <SelectValue placeholder="Select Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10000">10,000 calls/month</SelectItem>
                <SelectItem value="50000">50,000 calls/month</SelectItem>
                <SelectItem value="100000">100,000 calls/month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expiration Date */}
          <div className="grid gap-1.5">
            <Label>Expiration Date</Label>
            <div className="relative">
              <Input
                type="date"
                value={expirationDate}
                onChange={(e) => onChange("expirationDate", e.target.value)}
              />
              <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
          </div>

          {/* Allowed IPs */}
          <div className="grid gap-1.5">
            <Label>Allowed IPs (Optional)</Label>
            <Input
              placeholder="e.g., 192.168.1.1"
              value={allowedIPs}
              onChange={(e) => onChange("allowedIPs", e.target.value)}
            />
          </div>

          {/* Warning */}
          <Alert className="bg-yellow-50 border border-yellow-200 mt-1">
            <AlertDescription className="text-xs text-gray-700">
              Keep your API key private. You’ll only see it once after generation.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="mt-4 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} className="bg-black text-white hover:bg-gray-900">
            Generate Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
