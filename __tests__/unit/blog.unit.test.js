import {
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "@/lib/blog";

describe("Integration: Blog", () => {
  let blogId;

  test("create + read", async () => {
    blogId = await createBlog("Int Blog", "Inhoud", 1);
    expect(typeof blogId).toBe("number");

    const blog = await getBlogById(blogId);
    expect(blog).not.toBeNull();
  });

  test("update", async () => {
    await updateBlog(blogId, "Nieuwe titel", "Nieuwe inhoud");
    const blog = await getBlogById(blogId);
    expect(blog.title).toBe("Nieuwe titel");
  });

  test("delete", async () => {
    await deleteBlog(blogId);
    const blog = await getBlogById(blogId);
    expect(blog).toBeNull();
  });
});
