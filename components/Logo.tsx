import workLuneLogo from '@/public//worklune-logo.png';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

export function Logo({ size = 'md', showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <Image 
        src={workLuneLogo} 
        alt="WorkLune" 
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <span className={`font-bold text-foreground ${textSizeClasses[size]}`}>
          WorkLune
        </span>
      )}
    </div>
  );
}
