import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowUpFromLine, ArrowUpToLine, Edit2, Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const IncomesCard = ({ entrate = [], loading, handleEdit, handleDelete }) => {
  const [deleteItem, setDeleteItem] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const totalIncome = useMemo(() => {
    return entrate.reduce((sum, item) => sum + parseFloat(item.ammontare), 0);
  }, [entrate]);

  const renderList = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="text-center text-gray-500 flex flex-col items-center justify-center space-y-4 py-8">
          <ArrowUpFromLine className="text-gray-300 size-12" />
            <p className="text-lg font-medium">No income yet</p>
            <p className="text-sm text-gray-400">
              Start by adding a new entry to track your earnings!
            </p>
          </div>
      );
    }

    return data.map((item) => (
      <div key={item.id} className="flex justify-between items-center py-4 border-b last:border-b-0 group">
        <div>
          <p className="font-medium">{item.titolo}</p>
          <p className="text-sm text-gray-500">{format(new Date(item.data), 'dd/MM/yyyy')}</p>
        </div>
        <div className="flex items-center space-x-2 relative">
          <p className="font-semibold transition-all duration-300 group-hover:mr-24">
            {formatCurrency(item.ammontare)}
          </p>
          <div className="absolute right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
            <Button variant="outline" size="icon" onClick={() => handleEdit(item, 'entrate')}>
              <Edit2 className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setDeleteItem(item)}>
              <Trash2 className="size-4 text-red-600" />
            </Button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center space-x-2">
          <ArrowUpFromLine className="text-green-500" />
          <span>Incomes</span>
        </CardTitle>
        <div className="text-2xl font-bold text-green-500">+ {formatCurrency(totalIncome)}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          renderList(entrate)
        )}
      </CardContent>
      {deleteItem && (
        <AlertDialog open={true} onOpenChange={() => setDeleteItem(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this income?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. It will permanently delete the income 
                "{deleteItem?.titolo}" and remove its data from our server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className='bg-red-500 hover:bg-red-600 transition-all duration-300 ease-in-out' 
                onClick={() => {
                  handleDelete(deleteItem.id, 'entrate');
                  setDeleteItem(null);
              }}>
                <Save />
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
};

export default IncomesCard;



