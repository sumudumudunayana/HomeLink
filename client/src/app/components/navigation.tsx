import Link from "next/link";

export const Navigation = () => {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/products/1">Product 1</Link>
    </nav>
  );
};
