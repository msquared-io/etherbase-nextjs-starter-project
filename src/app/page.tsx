"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Code, Database } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Etherbase Demo</h1>
          <p className="text-muted-foreground">
            Choose a contract interaction mode to get started
          </p>
        </div>

        <Tabs defaultValue="source" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="source">Source Contract</TabsTrigger>
            <TabsTrigger value="custom">Custom Contract</TabsTrigger>
          </TabsList>

          <TabsContent value="source">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Etherbase Source Contract
                </CardTitle>
                <CardDescription>
                  Use the Etherbase Source API to interact with a contract
                  address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This mode uses the useEtherbaseSource hook to interact with
                  your contract. It provides a streamlined way to interact with
                  Etherbase contracts.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Default: 0x82C2FC0f1A8121a1c5280a811BcEfD48735AF306
                </p>
                <Link href="/source-contract">
                  <Button className="gap-1">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Custom Contract
                </CardTitle>
                <CardDescription>
                  Use the Etherbase Contract API to interact with a custom
                  contract address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This mode uses the useEtherbaseContract hook to interact with
                  your contract. You can specify any contract address and
                  increment its value.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Default: 0x82C2FC0f1A8121a1c5280a811BcEfD48735AF306
                </p>
                <Link href="/custom-contract">
                  <Button variant="secondary" className="gap-1">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
