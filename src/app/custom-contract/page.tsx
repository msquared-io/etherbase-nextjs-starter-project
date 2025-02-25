"use client"

import { useState, useCallback, useEffect } from "react"
import {
  useEtherbaseEvents,
  useEtherstore,
  useEtherbaseContract,
  type EtherstoreState,
  type EtherbaseEvent,
} from "@msquared/etherbase-client"
import ContractDisplay from "../components/ContractDisplay"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Address } from "viem"

export default function CustomContractPage() {
  const defaultContractAddress =
    "0x82C2FC0f1A8121a1c5280a811BcEfD48735AF306" as Address
  const [contractAddress, setContractAddress] = useState<Address>(
    defaultContractAddress,
  )
  const [inputValue, setInputValue] = useState<string>(defaultContractAddress)

  // Contract state
  const [currentValue, setCurrentValue] = useState<string>("")
  const [events, setEvents] = useState<EtherbaseEvent[]>([])
  const [isAutoIncrementing, setIsAutoIncrementing] = useState(false)
  const [updatesPerSecond, setUpdatesPerSecond] = useState<number>(10)

  // Handle state changes from Etherstore
  const handleStateChange = useCallback((state: EtherstoreState) => {
    setCurrentValue(state.value?.toString() || "")
  }, [])

  // Use Etherstore to read the current value
  useEtherstore({
    contractAddress,
    path: ["value"],
    onStateChange: handleStateChange,
    options: {
      fullStateUpdateOnChange: true,
      repoll: {
        listenEvents: [
          {
            name: "ValueChanged",
          },
        ],
      },
    },
  })

  // Use Etherbase Contract for execution
  const { execute } = useEtherbaseContract({ contractAddress })

  // Listen for contract events
  useEtherbaseEvents({
    contractAddress,
    events: [
      {
        name: "ValueChanged",
      },
    ],
    onEvent: useCallback((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 5)) // Add new events to start and keep first 5
    }, []),
  })

  // Handle form submission to update contract address
  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    },
    [],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      // Ensure the input is a valid address before setting it
      if (inputValue.startsWith("0x")) {
        // This is a type assertion that tells TypeScript to treat the string as an Address
        setContractAddress(inputValue as Address)
      }
    },
    [inputValue],
  )

  // Contract interaction functions
  const handleIncrement = useCallback(() => {
    execute({
      methodName: "increment",
      args: {},
    })
  }, [execute])

  const handleToggleAutoIncrement = useCallback(() => {
    setIsAutoIncrementing((prev) => !prev)
  }, [])

  const handleUpdateRateChange = useCallback((value: number) => {
    setUpdatesPerSecond(value)
  }, [])

  // Auto-increment effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isAutoIncrementing) {
      const intervalMs = 1000 / updatesPerSecond

      intervalId = setInterval(() => {
        handleIncrement()
      }, intervalMs)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isAutoIncrementing, updatesPerSecond, handleIncrement])

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Tabs defaultValue="custom" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="source" asChild>
              <Link href="/source-contract">Source Contract</Link>
            </TabsTrigger>
            <TabsTrigger value="custom" asChild>
              <Link href="/custom-contract">Custom Contract</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Custom Contract</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2"
          >
            <Input
              type="text"
              value={inputValue}
              onChange={handleAddressChange}
              placeholder="Enter contract address"
              className="flex-grow"
            />
            <Button type="submit">Update</Button>
          </form>
        </CardContent>
      </Card>

      <ContractDisplay
        contractAddress={contractAddress}
        currentValue={currentValue}
        isAutoIncrementing={isAutoIncrementing}
        updatesPerSecond={updatesPerSecond}
        events={events}
        onIncrement={handleIncrement}
        onToggleAutoIncrement={handleToggleAutoIncrement}
        onUpdateRateChange={handleUpdateRateChange}
        mode="custom"
      />
    </div>
  )
}
