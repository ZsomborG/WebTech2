import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/AuthService';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const { confirmPassword: _, ...registerData } = data;
      const userData = await authService.register(registerData);
      login(userData);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-zinc-50 p-4 overflow-hidden">
      {/* Subtle Dot Pattern Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px][mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <Card className="w-full max-w-md z-10 bg-white/80 backdrop-blur-xl border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <CardHeader className="space-y-2 pb-6 pt-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-zinc-900 tracking-tight">Create an account</CardTitle>
          <CardDescription className="text-center text-zinc-500">
            Join the library system today
          </CardDescription>
        </CardHeader>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-zinc-700">Username</Label>
              <Input id="username" {...register('username')} placeholder="Choose a name" className="bg-white/50" />
              {errors.username && <p className="text-xs text-rose-500">{errors.username.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-zinc-700">Password</Label>
              <Input id="password" type="password" {...register('password')} placeholder="Min 6 characters" className="bg-white/50" />
              {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-zinc-700">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...register('confirmPassword')} placeholder="Repeat password" className="bg-white/50" />
              {errors.confirmPassword && <p className="text-xs text-rose-500">{errors.confirmPassword.message}</p>}
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium text-center border border-rose-100">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            <div className="text-sm text-center text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
