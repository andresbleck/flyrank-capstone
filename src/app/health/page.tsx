type Post = {
  id: number;
  title: string;
};

export default async function Health() {
  let posts: Post[] = [];
  let error = false;

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts",
      { cache: "no-store" },
    );

    if (!response.ok) {
      error = true;
    } else {
      posts = await response.json();
    }
  } catch {
    error = true;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Health Check</h1>
      {error ? (
        <p className="mt-4 text-base">Failed to fetch data</p>
      ) : (
        <ul className="mt-4 list-disc pl-5 text-base">
          {posts.slice(0, 5).map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
