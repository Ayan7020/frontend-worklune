'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AuthService } from '@/services/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiException } from '@/lib/http/errors';
import { toast } from 'sonner';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OtpPage() {
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const email = useSearchParams().get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [otpError, setOtpError] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const useNavigate = useRouter();

  if (!email) {
    return null;
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const otpValue = useMemo(() => code.join(''), [code]);
  const isComplete = useMemo(() => code.every((d) => d.length === 1), [code]);

  const handleChange = (index: number, value: string) => {
    const next = [...code];
    const digits = value.replace(/\D/g, '');

    if (!digits) {
      next[index] = '';
      setCode(next);
      return;
    }

    // Support pasting multiple digits
    if (digits.length > 1) {
      for (let i = 0; i < digits.length && index + i < OTP_LENGTH; i += 1) {
        next[index + i] = digits[i];
      }
      setCode(next);
      const nextFocus = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    next[index] = digits;
    setCode(next);

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      const next = [...code];
      next[index - 1] = '';
      setCode(next);
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isComplete) return;
    setIsLoading(true);
    setOtpError(null);
    if (!email) {
      return;
    }
    try {
      await AuthService.verifyOtp(email, otpValue); 
      useNavigate.push("/login");
    } catch(error: any) {
      if(error instanceof ApiException) {
        if(error.details && "validationError" in error.details) {
          setOtpError(((error.details as any).validationError[0].message) || "something went wrong")
        } else {
          toast.error(error.message)
        }
      }
    } finally {

      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    setCode(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    // Simulate resend call
    console.log('OTP resent');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Logo size="md" />
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Verify your email</CardTitle>
              <CardDescription className="text-center">
                Enter the 6-digit code we sent to your email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    Verification code
                  </Label>
                  <div className="grid grid-cols-6 gap-2 sm:gap-3" id="otp">
                    {code.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="\d*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`text-center text-lg font-semibold h-12 ${otpError ? 'border-destructive' : ''}`}
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                  {otpError && (
                    <p className="text-xs text-destructive">{otpError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    This code expires in 10 minutes.
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>Didn&apos;t receive the code?</div>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={secondsLeft > 0 || isLoading}
                    className="text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend code'}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={!isComplete || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify and continue'
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Wrong email?{' '}
                  <Link href="/signup" className="text-primary hover:underline">
                    Change it here
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
