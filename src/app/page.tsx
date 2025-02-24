"use client"

import { useEtherbaseEvents, useEtherstore, useEtherbaseContract } from "@msquared/etherbase-client";
import { useCallback, useState, useEffect } from "react";

export default function Home() {
  const contractAddress = "0x82C2FC0f1A8121a1c5280a811BcEfD48735AF306";
  const [currentValue, setCurrentValue] = useState<string>("");
  const [events, setEvents] = useState<any[]>([]);
  const [isAutoIncrementing, setIsAutoIncrementing] = useState(false);

  const handleStateChange = useCallback((state: any) => {
    setCurrentValue(state.value?.toString() || "");
  }, []);

  useEtherstore({
    contractAddress,
    path: ["value"],
    onStateChange: handleStateChange
  });

  const { execute } = useEtherbaseContract({
    contractAddress
  });

  useEtherbaseEvents({
    contractAddress,
    events: [{
      name: "ValueChanged",
    }],
    onEvent: (event) => {
      setEvents(prev => [event, ...prev].slice(0, 5)); // Add new events to start and keep first 5
    }
  });

  const incrementBrowser = () => {
    console.log("Increment (browser) clicked");
  };

  const incrementBackend = () => {
    execute({
      methodName: "increment",
      args: {},
    });
  };

  const toggleAutoIncrement = () => {
    setIsAutoIncrementing(!isAutoIncrementing);
    console.log(`Auto increment ${!isAutoIncrementing ? 'started' : 'stopped'}`);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isAutoIncrementing) {
      intervalId = setInterval(() => {
        execute({
          methodName: "increment",
          args: {},
        });
      }, 200); // 5 times per second
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoIncrementing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Current Value Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            Current Value
          </h2>
          <p className="text-3xl font-semibold text-slate-900 dark:text-white mb-4">
            {currentValue || "—"}
          </p>
          
          {/* New Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={incrementBrowser}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Increment (browser)
            </button>
            <button
              onClick={incrementBackend}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Increment (backend)
            </button>
            <button
              onClick={toggleAutoIncrement}
              className={`px-4 py-2 ${
                isAutoIncrementing 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-purple-500 hover:bg-purple-600'
              } text-white rounded-lg transition-colors`}
            >
              {isAutoIncrementing ? 'Stop Auto Increment' : 'Start Auto Increment'}
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
            Recent Events
          </h2>
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-sm">
                No events yet
              </p>
            ) : (
              events.map((event, index) => (
                <div
                  key={`event-${index}`}
                  className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <pre className="text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {JSON.stringify(event, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contract Info */}
        <div className="text-xs text-center text-slate-400 dark:text-slate-500">
          Contract: {contractAddress}
        </div>
      </div>
    </div>
  );
}
