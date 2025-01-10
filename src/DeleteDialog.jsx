import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
  

const DeleteDialog = ({ open, onClose, onConfirm, expenseId }) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this expense?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel variant="outline" onClick={onClose}>
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction
                className="bg-red-500 text-white"
                onClick={() => {
                onConfirm(expenseId);
                onClose();
                }}
            >Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteDialog;
