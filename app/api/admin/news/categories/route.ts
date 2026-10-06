import { requireAdmin } from "@/lib/auth";
import { getNewsCategories } from "@/lib/news-categories-server";
import { NextRequest,NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    try {
        await requireAdmin(req);
    }
    catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ categories: await getNewsCategories() });
}
export async function PATCH(req: NextRequest) {
    try {
        const session = await requireAdmin(req);
        if (session.role === "VIEWER")
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
}
