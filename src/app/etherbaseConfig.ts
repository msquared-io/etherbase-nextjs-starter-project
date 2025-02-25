import { type EtherbaseConfig, somnia } from "@msquared/etherbase-client"

export const etherbaseConfig: EtherbaseConfig = {
  chain: somnia,
  httpReaderUrl: "https://etherbase-reader-496683047294.europe-west2.run.app",
  wsReaderUrl: "wss://etherbase-reader-496683047294.europe-west2.run.app",
  wsWriterUrl: "wss://etherbase-writer-496683047294.europe-west2.run.app",
  privateKey:
    "0x0c9a44c9e7778f9f3132ab2ad581b1473f84683e6b42da3938160dc602ee29d0",
  useBackend: true,
}
