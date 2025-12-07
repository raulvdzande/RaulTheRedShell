import Link from "next/link";

export default function BlogCard({ blog }) {
  return (
    <Link href={`/blogs/${blog.id}`}>
      <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-lg transition cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
        <p className="text-gray-600 line-clamp-3">{blog.content}</p>
        <p className="mt-3 text-sm text-gray-400">
          {new Date(blog.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}