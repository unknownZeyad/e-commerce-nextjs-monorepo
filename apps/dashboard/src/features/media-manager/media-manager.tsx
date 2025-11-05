'use client'

import { Button } from "@packages/client/src/components/ui/button"
import { useGetMediaFiles } from "./hooks/use-get-media-files"
import { formatCloudinaryTime } from "./utils"
import { RiDeleteBin5Fill } from "react-icons/ri";
import { CloudinaryAssetsResponse } from "./types";
import { useDeleteMediaFile } from "./hooks/use-delete-media-file";
import { ImSpinner8 } from "react-icons/im";
import { array } from "@packages/client/src/lib/utils";

function MediaManager() {
  const { data, isLoading, next, previous } = useGetMediaFiles()

  return (
    <>
      <div className='flex items-center gap-6 mb-10 justify-between'>
        <div>
          <h3 className='text-3xl mb-1 font-semibold'>Media Manager</h3>
          <p className='text-white/60'>Track, Edit, Delete And Upload All Your Assets</p>
        </div>
        <div className="flex w-fit gap-3">
          <Button variant='outline' onClick={previous}>
            Previous
          </Button>
          <Button variant='outline' onClick={next}>
            Next
          </Button>
        </div>
      </div>
      <div className="gap-6 space-y-6 [column-fill:_balance] columns-3 xl:columns-4">
        {isLoading ? (
          array(0, 5).map((_,idx) => (
            <div
              key={idx}
              className="skeleton w-full rounded-xl break-inside-avoid"
              style={{ height: `${(idx+1) * 100}px` }}
            />
          ))
        ): data?.length ? data.map((curr) => (
          <MediaFile {...curr} key={curr.public_id}/>
        )) : <p className="text-zinc-300 font-medium">No Assets To Show</p>}
      </div>
    </>
  )
}

export default MediaManager

function MediaFile ({ url, display_name, created_at, width, height, public_id }: CloudinaryAssetsResponse['resources'][number]) {
  const { deleteFile, isDeleting } = useDeleteMediaFile()

  return (
    <div className="relative border h-fit border-white/15 rounded-xl overflow-hidden">
      <img 
        className="block w-full object-contain" 
        src={url}
        style={{
          aspectRatio: width/height
        }}
      />
      <div className="px-2 flex gap-2 py-4 bg-light-black">
        <div className="font-medium flex-1 space-y-1 text-xs">
          <p className="break-all font-semibold">{display_name}</p>
          <p className="text-zinc-300">{formatCloudinaryTime(created_at)}</p>
          <p className="text-zinc-300">{width}px x {height}px</p>
        </div>
        <Button 
          size='sm' 
          onClick={() => deleteFile(public_id)}
          variant='destructive'
          disabled={isDeleting}
        > 
          {isDeleting ? <ImSpinner8 className="animate-spin"/> : <RiDeleteBin5Fill/>}
        </Button>
      </div>
    </div>
  )
}
