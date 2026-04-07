import type { SVGProps } from 'react';

export function PadelVerseLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
      width="200"
      height="40"
      {...props}
    >
      <text
        x="10"
        y="30"
        fontFamily="Inter, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        Padel
        <tspan fill="hsl(var(--foreground))">Verse</tspan>
      </text>
    </svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.55 1.9-3.47 0-6.3-2.89-6.3-6.4s2.83-6.4 6.3-6.4c1.93 0 3.28.77 4.27 1.7l2.5-2.5C17.96 1.69 15.47 0 12.48 0 5.6 0 0 5.6 0 12.4s5.6 12.4 12.48 12.4c7.2 0 12.04-4.92 12.04-12.72 0-.8-.08-1.56-.2-2.32H12.48z" />
    </svg>
  );
}
