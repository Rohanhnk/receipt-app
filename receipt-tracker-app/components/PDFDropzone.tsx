"use client";

import { AlertCircle, CheckCircle, CloudUpload, Pointer } from "lucide-react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useCallback, useState } from "react";
import { useRouter } from "next/dist/client/components/navigation";
import { Button } from "@schematichq/schematic-components";

function PDFDropzone() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const {user} = useUser();
  const {
    value: isFeatureEnabled,
    featureUsageExceeded,
    featureUsage,
    featureAllocation,
  }, useSchematicEntitlement("scans");
  
  //Set up sensors for drag detection
  const sensors = useSensors(useSensor(PointerSensor));

const handleUpload = useCallback(
  async (files: FileList | File[]) => {
    if (!user) {
      alert("Please sign in to upload files.");
      return;
    }

    const fileArray = Array.from(files);
    const pdfFiles = fileArray. filter(
      (file) =>
        file.type === "application/pdf" ||
      file.name.toLowerCase(). endsWith(".pdf"),
);

if(pdfFiles.length ===0){
alert("please drop inly PDF files.");
  return;
}

setIsUploading(true);

try{
  //Upload files
  const newUploadedFiles: string[] = [];

  for(const file of pdf Files) {
    // Creating a FormData object to use with the server action
    const formData = new FormData();
    formData.append("file", file);

    //Call the server action to handle the upload 
    const result = await uploadPDF(formData);

    if(!result.success){
      throw new Error(result.error);
  }

  newUploadedFiles.push(file.name);
}

setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);

//clear uploaded files list after 5 seconds
setTimeout(() => {
setUploadedFiles([]);
}, 5000);

router.push("/receipts");
}catch(error){
  console.error("Upload failed:", error);
alert(
`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`
);
}finally{
  setIsUploading(false)
}
}, [user,router],
    )
  

  //Handle file drop via native browser events for better PDF support
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (!user) {
      alert("PLease sign in to upload files.");
      return;
    }

    if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, [user, handleUpload]);

  const isUserSignedIn = !!user;
  const canUpload = isUserSignedIn && isFeatureEnabled;

  return (
    <DndContext sensors={sensors}>
      <div className="w-full max-w-md mx-auto ">
        <div
          onDragOver={canUpload ? handleDragOver : undefined}
          onDragLeave={canUpload ? handleDragLeave : undefined}
          onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDraggingOver ? "border-blue-500 bg-blue-50" : "border-gray-300 "
          }${!canUpload ? "opactity-70 cursor-not-allowed" : ""}`}
        >

          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2" ></div>
              <p className="text-blue-600 font-medium">Uploading...</p>
            </div>
          ) : !isUserSignedIn ?  (
            <>
            <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-600">Please sign in to upload files</p>
            </>
          ) : (
            <>
            <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-600">
              Drag and drop PDF files here, or click to select files
            </p>
            <input
              type="file"
              ref={fileInputRedf}
              accept="application.pdf,.pdf"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isFeatureEnabled}
            onClick={triggeredFileInput}
            >
              {isFeatureEnabled ? "Select PDF Files" : "Upgrade to upload"}
            </Button>
            </>
          )}
          </div>

        <div className="mt-4">  
          {featureUsageExceeded && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>
                You have exceeded your feature usage limit of {featureAllocation} scans. Please upgrade your plan.
              </span>
            </div>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium">Uploaded Files:</h3>
            <ul className="mt-2 text-sm text-grey-6000 space-y-1">
              {uploadedFiles.map((fileName, i) => (
                <li key={i} className ="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  {fileName}
                  </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DndContext>
  );
}
export default PDFDropzone;
