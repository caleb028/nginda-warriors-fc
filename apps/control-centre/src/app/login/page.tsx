'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthAndBootstrapGate } from '../../components/AuthAndBootstrapGate';

export default function LoginPage() {
  const router = useRouter();

  const handleAuthenticated = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/manage';
    } else {
      router.push('/');
    }
  };

  return (
    <AuthAndBootstrapGate
      bootstrapped={true}
      onAuthenticated={handleAuthenticated}
    />
  );
}
