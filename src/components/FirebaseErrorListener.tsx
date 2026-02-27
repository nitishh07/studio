'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In a real development environment, this would trigger the Next.js error overlay.
      // Here we show a destructive toast with the context.
      toast({
        variant: 'destructive',
        title: 'Firestore Permission Denied',
        description: `Operation: ${error.context.operation} at ${error.context.path}`,
      });
      
      // We also throw to trigger error boundaries or dev overlays if possible
      console.error('Firebase Security Rule Denial:', error.context);
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
