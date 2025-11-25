"user server";

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { currentUser } from "@clerk/nextjs/server";
import { getFileDownloadUrl } from "./getFileDownloadUrl";

export async function uploadPDF(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    //Get files from the data
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    //Validate file type
    if (
      !file.type.includes("pdf") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return { success: false, error: "only PDF files are allowed" };
    }

    //Get uploaded URL from the server
    const uploadUrl = await convex.mutation(api.receipts.generateUploadUrl, {});

    //conver file to arrayBuffer for fetch api
    const arrayBuffer = await file.arrayBuffer();

    //Upload the file to convex storage
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: new Uint8Array(arrayBuffer),
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file : ${uploadResponse.statusText}`);
    }

    //Get storage ID from the response
    const { storageId } = await uploadResponse.json();

    //Add receipt to the database
    const receiptId = await convex.mutation(api.receipts.storeReceipts, {
      userId: user.id,
      fileId: storageId,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });

    //Generate the file URl
    const fileUrl = await getFileDownloadUrl(storageId);

    return {
      success: true,
      data: {
        receiptId,
        fileName: file.name,
      },
    };
  } catch (error) {
    console.error("server action uploaded error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred ",
    };
  }
}
