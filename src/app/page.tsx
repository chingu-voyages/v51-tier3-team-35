import Link from "next/link";

export default function Home() {
  return (
    // <div>
    //   <h1>Home Page</h1>
    //   <Link href="/users">
    //   <button className="btn btn-primary">USERS PAGE</button>
    //   </Link>
    // </div>

    
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="container mx-auto px-6 lg:flex lg:items-center">

          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
              Welcome to <span className="text-blue-600">Adventure Canvas</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Explore the world and chart your next adventure effortlessly!
            </p>
            <div className="flex space-x-8 justify-center">
              <Link href="/signin" className="btn btn-primary">
                Sign In
              </Link>
              <Link href="/signup" className="btn btn-outline">
                Sign Up
              </Link>
            </div>
          </div>
  
          <div className="lg:w-1/2 lg:mt-0 mt-10">
            <div className="flex justify-center">
              <div className="w-2/3 h-64 bg-gray-200 rounded-lg flex items-center justify-center">

                <span className="text-gray-500">GIF goes here</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

}
