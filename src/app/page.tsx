import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between h-16 px-4 shrink-0 md:px-6">
        <Link className="flex items-center gap-2" href="#">
          <span className="text-lg font-semibold">Summon</span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          <Link
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            Contact
          </Link>
        </nav>
        <div className="hidden gap-4 md:flex">
          <Button asChild variant="outline">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/register">Sign up</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden" size="icon" variant="outline">
              <MenuIcon className="w-6 h-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="grid gap-6 p-6">
              <Link className="flex items-center gap-2" href="#">
                <span className="text-lg font-semibold">Summon</span>
              </Link>
              <nav className="grid gap-4 text-sm font-medium">
                <Link
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  href="#"
                >
                  Features
                </Link>
                <Link
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  href="#"
                >
                  Pricing
                </Link>
                <Link
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  href="#"
                >
                  Contact
                </Link>
              </nav>
              <div className="grid gap-4">
                <Button asChild variant="outline">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign up</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center md:px-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                AI Powered Telemarketing
              </h1>
              <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                AI-powered solution for telemarketing that helps you to increase your sales and revenue.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="#">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col items-center justify-center gap-2 p-4 text-xs text-center border-t shrink-0 md:flex-row md:px-6">
        <p className="text-gray-500 dark:text-gray-400">© 2024 Summon. All rights reserved.</p>
        <nav className="flex gap-4 sm:ml-auto">
          <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
