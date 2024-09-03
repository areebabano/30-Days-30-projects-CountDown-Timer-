"use client"
import { useState, useRef, ChangeEvent, useEffect } from "react"
import {Button} from "./ui/button"
import { Input } from "./ui/input"

export default function CountDown() {
    const [duration , setDuration] = useState<number | string>(""); // input duration
    const [timeLeft, setTimeLeft] = useState<number>(0) // remaining time
    const [isActive , setIsActive] = useState<boolean>() // active status
    const [isPaused , setIsPaused] = useState<boolean>(false) // pause status
    const timerRef = useRef<NodeJS.Timeout | null>(null); // ref to store timer id

// handle duration of the count down timer

const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration); 
      setIsActive(false); 
      setIsPaused(false); 
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };


// handle change duration input field 

const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
  setDuration(Number(e.target.value) || "")
}


// start Timer 

const handleStartTimer = (): void => {
  if(timeLeft > 0){
    setIsActive(true);
    setIsPaused(false)
  }
}

// pause timer 

const handlePauseTimer = (): void => {
  if(isActive){
    setIsPaused(true)
    setIsActive(false)
    if(timerRef.current){
      clearInterval(timerRef.current)
    }
  }
}

//  reset timer

const handleResetTimer = (): void => {
  setIsActive(false)
  setIsPaused(false)
  setTimeLeft(typeof duration === "number"? duration : 0)
  if(timerRef.current){
    clearInterval(timerRef.current)
  }
}

useEffect(()=>{
  if (isActive && !isPaused){
    timerRef.current = setInterval(()=>{
      setTimeLeft(prevTime => {
        if(prevTime <= 1){
          clearInterval(timerRef.current!)
          return 0;
        }
        return prevTime - 1;
      })
    }, 1000)

    return () => {
      if (timerRef.current){
        clearInterval(timerRef.current)
      }
    }
  }
}, [isActive,isPaused])

// format time in mm:ss

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

return (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-200 dark:bg-gray-900">
      <div className=" border border-black bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
          COUNTDOWN TIMER⏰

          </h1>
          <div className="flex items-center mb-6">
              <Input
                  type="number"
                  id="duration"
                  placeholder="Enter duration in seconds"
                  value={duration}
                  onChange={handleDurationChange}
                  className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <Button
                  onClick={handleSetDuration}
                  variant="outline"
                  className="text-gray-800 dark:text-gray-200"
              >
                  Set
              </Button>
          </div>
          <div className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
              {formatTime(timeLeft)}
          </div>
          <div className="flex justify-center gap-4">
              <Button
                  onClick={handleStartTimer}
                  variant="outline"
                  className="text-black dark:text-gray-200"
              >
                  {isPaused ? "Resume" : "Start"}
              </Button>
              <Button
                  onClick={handlePauseTimer}
                  variant="outline"
                  className="text-black dark:text-gray-200"
              >
                  Pause
              </Button>
              <Button
                  onClick={handleResetTimer}
                  variant="outline"
                  className="text-black dark:text-gray-200"
              >
                  Reset
              </Button>
          </div>
      </div>
  </div>
);
};