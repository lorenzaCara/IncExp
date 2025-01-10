import * as React from "react"
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

const DataPicker = ({ selectedDate = {}, handleDateChange = () => {} }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentYear, setCurrentYear] = React.useState(selectedDate.year || new Date().getFullYear())

  const handleMonthSelect = (month) => {
    const newDate = {
      month: month + 1,
      year: currentYear
    }
    handleDateChange(newDate)
    setIsOpen(false)
  }

  const changeYear = (increment) => {
    const newYear = currentYear + increment
    setCurrentYear(newYear)
    handleDateChange({
      month: selectedDate.month,
      year: newYear
    })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !selectedDate.month && "text-muted-foreground"
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {selectedDate.month && selectedDate.year
            ? `${monthNames[selectedDate.month - 1]} ${selectedDate.year}`
            : "Select month/year"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" size="icon" onClick={() => changeYear(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{currentYear}</span>
            <Button variant="outline" size="icon" onClick={() => changeYear(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {monthNames.map((month, index) => (
              <Button
                key={month}
                variant="outline"
                className={cn(
                  "text-sm",
                  selectedDate.month === index + 1 && selectedDate.year === currentYear && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleMonthSelect(index)}
              >
                {month}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DataPicker
