import Link from "next/link";

export default function navBar(){
    return (
        <nav className="navbar bg-base-100 shadow-md">
          <div className="container mx-auto flex justify-between items-center">

            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold">
                Adventure Canvas
              </Link>
            </div>
    
            <div className="flex space-x-4">
              <Link href="/signin" className="btn btn-outline">
                Sign In
              </Link>
              <Link href="#" className="btn btn-primary">
                Start New Canvas
              </Link>
            </div>
          </div>
        </nav>
      );
}