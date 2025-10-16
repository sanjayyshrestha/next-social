"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";
import Image from "next/image";

interface Props{
  onChange:(url:string)=>void,
  value:string,
  endpoint:'imageUploader'

}

const ImageUpload = ({onChange,value,endpoint}:Props) => {

  if(value){
    return (
       <div className="relative size-40">
        <Image src={value} alt="Upload" className="rounded-md size-40 object-cover" />
        <button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm"
          type="button"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    )
  }
  return (
    <UploadDropzone 
    endpoint={endpoint}
    onClientUploadComplete={(res)=>{
      console.log('Response : ',res)
      onChange(res?.[0].ufsUrl)
    }}
    onUploadError={(error:Error)=>{
      console.log(error)
    }}
     />
  )
}

export default ImageUpload
