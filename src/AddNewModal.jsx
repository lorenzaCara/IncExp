import { useState, useEffect } from 'react';
import { z } from 'zod'; 
import { CalendarIcon, Save } from 'lucide-react';
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Schema di validazione
const transactionSchema = z.object({
  titolo: z.string().min(1, "Description is required"),
  data: z.string().optional(), 
  ammontare: z.preprocess((value) => parseFloat(value), z.number().positive("Amount must be positive")),
  type: z.enum(["entrate", "uscite"], "Invalid transaction type"),
});

const AddNewModal = ({ item, onSave, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    titolo: '',
    data: '',
    ammontare: '',
    type: 'entrate',
  });
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    setFormData(item || {
      titolo: '',
      data: '',
      ammontare: '',
      type: 'entrate',
    });
    setErrors({});
  }, [item]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = transactionSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            {item && item.id ? 'Update' : 'Add'} transaction
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleChange('type', value)}
              className="flex gap-4"
            >
              <label className="flex-1">
                <input
                  type="radio"
                  className="peer hidden"
                  name="type"
                  value="uscite"
                  checked={formData.type === "uscite"}
                  onChange={() => handleChange('type', 'uscite')}
                />
                <div className="flex items-center gap-2 rounded-lg border-2 border-muted p-4 peer-checked:border-primary">
                  <RadioGroupItem value="uscite" id="uscite" />
                  <Label htmlFor="uscite">Expense</Label>
                </div>
              </label>
              <label className="flex-1">
                <input
                  type="radio"
                  className="peer hidden"
                  name="type"
                  value="entrate"
                  checked={formData.type === "entrate"}
                  onChange={() => handleChange('type', 'entrate')}
                />
                <div className="flex items-center gap-2 rounded-lg border-2 border-muted p-4 peer-checked:border-primary">
                  <RadioGroupItem value="entrate" id="entrate" />
                  <Label htmlFor="entrate">Income</Label>
                </div>
              </label>
            </RadioGroup>
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="titolo" className="text-sm font-medium">Description</Label>
            <Input
              id="titolo"
              value={formData.titolo}
              onChange={(e) => handleChange('titolo', e.target.value)}
              className="bg-muted"
            />
            {errors.titolo && <p className="text-red-500 text-sm">{errors.titolo}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ammontare" className="text-sm font-medium">Amount</Label>
            <Input
              id="ammontare"
              type="number"
              value={formData.ammontare}
              onChange={(e) => handleChange('ammontare', e.target.value)}
              className="bg-muted"
            />
            {errors.ammontare && <p className="text-red-500 text-sm">{errors.ammontare}</p>}
          </div>

          {/* per far si che la Dialog e il Popover non si aprano entrambi nel body come portal. Ho commentato nel componente Popover di shadCn PopoverPrimitive.Portal */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal bg-muted ${!formData.data && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.data ? format(new Date(formData.data), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.data ? new Date(formData.data) : undefined}
                  onSelect={(date) => handleChange('data', date ? format(date, "yyyy-MM-dd") : '')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800">
              <Save />
              {item && item.id ? 'Update' : 'Add'} transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewModal;