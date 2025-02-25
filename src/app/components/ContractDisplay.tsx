"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Code } from "lucide-react"
import type { Address } from "viem"
import type { EtherbaseEvent } from "@msquared/etherbase-client"
interface ContractDisplayProps {
  contractAddress: Address
  currentValue: string
  isAutoIncrementing: boolean
  updatesPerSecond: number
  events?: EtherbaseEvent[]
  onIncrement: () => void
  onToggleAutoIncrement: () => void
  onUpdateRateChange: (value: number) => void
  mode: "source" | "custom"
}

export default function ContractDisplay({
  contractAddress,
  currentValue,
  isAutoIncrementing,
  updatesPerSecond,
  events = [],
  onIncrement,
  onToggleAutoIncrement,
  onUpdateRateChange,
  mode,
}: ContractDisplayProps) {
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!Number.isNaN(value) && value >= 1 && value <= 25) {
      onUpdateRateChange(value)
    }
  }

  return (
    <div className="container mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Current Value</CardTitle>
              <CardDescription>
                {mode === "custom"
                  ? "Using Etherbase Contract API"
                  : "Using Etherbase Source API"}
              </CardDescription>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-xs">
              Contract: {contractAddress.substring(0, 6)}...
              {contractAddress.substring(contractAddress.length - 4)}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => navigator.clipboard.writeText(contractAddress)}
                title="Copy address"
              >
                <Code className="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-6">{currentValue || "—"}</div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={onIncrement} variant="default">
              Increment
            </Button>
            <Button
              onClick={onToggleAutoIncrement}
              variant={isAutoIncrementing ? "destructive" : "secondary"}
            >
              {isAutoIncrementing
                ? "Stop Auto Increment"
                : "Start Auto Increment"}
            </Button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm">Updates per second:</span>
            <Input
              type="number"
              min="1"
              max="25"
              value={updatesPerSecond}
              onChange={handleRateChange}
              className="w-20"
            />
            <span className="text-xs text-muted-foreground">
              (Min: 1, Max: 25)
            </span>
          </div>
        </CardContent>
      </Card>

      {mode === "custom" && events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto">
            <div className="space-y-2">
              {events.length === 0 ? (
                <p className="text-muted-foreground text-sm">No events yet</p>
              ) : (
                events.map((event) => (
                  <div
                    key={`event-${event.name}-${event.args.value}`}
                    className="p-2 bg-muted rounded-md text-xs"
                  >
                    <pre className="font-mono whitespace-pre-wrap overflow-x-auto">
                      {JSON.stringify(event, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
