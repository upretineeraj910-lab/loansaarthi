import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/Blog";


export async function POST(req: NextRequest) {
    try {
       await connectToDatabase();

        const body = await req.json();
        const { title, slug, category, excerpt, content, authorId, readTime } = body;

        if (!title || !slug || !category || !excerpt || !content)
            return NextResponse.json(
                { success: false, message: "Title, slug, category, excerpt, and content are required." },
                { status: 400 }
            );

        const existingBlog = await Blog.findOne({ slug });
        if (existingBlog) {
            return NextResponse.json(
                { success: false, message: "This slug is already in use. Please choose a different slug." },
                { status: 409 }
            );
        }

        const newBlog = await Blog.create({
          title,
          slug,
          category,
          excerpt,
          content,
          readTime: readTime || "5 min read",
          authorId: authorId || undefined,
        });

    return NextResponse.json(
      { 
        success: true, 
        message: "Blog successfully created!", 
        data: newBlog 
      },
      { status: 201 }
    );
    } catch (error :any) {
        console.error("Error creating blog:", error);
        return NextResponse.json(
            { success: false, message: "An error occurred while creating the blog." },
            { status: 500 }
        );
    }
}




export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({})
      .select("title slug category excerpt createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: blogs.length,
        data: blogs,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}