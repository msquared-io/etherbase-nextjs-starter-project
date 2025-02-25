"use client"

import { useState, useCallback, useEffect } from "react"
import { type EtherstoreState, useEtherstore } from "@msquared/etherbase-client"
import ContractDisplay from "../components/ContractDisplay"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Address } from "viem"

export default function SourceContractPage() {
  const defaultContractAddress =
    "0x2e30b662c4Df268edA9efce596CDF3896b50B43C" as Address
  const [contractAddress, setContractAddress] = useState<Address>(
    defaultContractAddress,
  )
  const [inputValue, setInputValue] = useState<string>(defaultContractAddress)

  const [isAutoIncrementing, setIsAutoIncrementing] = useState(false)
  const [updatesPerSecond, setUpdatesPerSecond] = useState<number>(10)

  // Contract state
  const [currentValue, setCurrentValue] = useState<string>("")

  // Handle state changes from Etherstore
  const handleStateChange = useCallback((state: EtherstoreState) => {
    setCurrentValue(state.value?.toString() || "")
  }, [])

  // Use Etherstore to read the current value
  const { update } = useEtherstore({
    contractAddress,
    path: ["value"],
    onStateChange: handleStateChange,
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
      if (inputValue.startsWith("0x")) {
        setContractAddress(inputValue as Address)
      }
    },
    [inputValue],
  )

  const handleIncrement = useCallback(() => {
    const currentNumericValue = Number.parseInt(currentValue) || 0
    update({
      value: currentNumericValue + 1,
    })
  }, [currentValue, update])

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
        <Tabs defaultValue="source" className="w-full">
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
          <CardTitle>Etherbase Source Contract</CardTitle>
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
        onIncrement={handleIncrement}
        onToggleAutoIncrement={handleToggleAutoIncrement}
        onUpdateRateChange={handleUpdateRateChange}
        mode="source"
      />
    </div>
  )
}
