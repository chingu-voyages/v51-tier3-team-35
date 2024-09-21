import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link href="/users">
      <button className="btn btn-primary">USERS PAGE</button>
      </Link>
    </div>
  );
}
