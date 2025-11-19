import { NextRequest, NextResponse } from "next/server";
import { uploadPdfToS3 } from "@/lib/s3";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "파일 필요" }, { status: 400 });
        }

        // S3 업로드
        const s3Key = await uploadPdfToS3(file);

        // DB 저장 제거 → S3 정보만 반환
        return NextResponse.json({
            fileName: file.name,
            s3Key
        });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: "업로드 실패", detail: e.message }, { status: 500 });
    }
}
