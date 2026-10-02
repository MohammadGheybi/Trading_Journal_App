import React from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = 'Delete', onConfirm }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-border bg-surface">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-xl font-medium">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl border-border bg-transparent">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="rounded-xl bg-loss text-obsidian hover:bg-loss/90">{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}