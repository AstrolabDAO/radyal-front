import { useCurrentSteps } from "~/hooks/store/operation";
import SwapRouteDetail from "../SwapRouteDetail";

const SwapStepsModal = () => {
  const currentSteps = useCurrentSteps();

  return (
    <div className="modal-wrapper">
      <div className="flex flex-col gap-3">
        <div className="text-3xl text-white uppercase font-bold gilroy px-2 my-auto text-center">
          Tx tracking
        </div>
        <div className="mx-auto">
          <img
            className="w-16 h-16"
            src="https://s3.getstickerpack.com/storage/uploads/sticker-pack/hot-cherry-nazaralnazrii/sticker_9.webp?1cb87efbfa2b3052f7f5d8bf0e32ed1c&d=200x200" alt=""
          />
        </div>
        <div className="mb-1 font-medium text-gray-500 px-2 text-center">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Non praesentium odit necessitatibus facilis at nam inventore
          tenetur ex reiciendis veritatis. Provident quis laboriosam
          quam quo vel totam quibusdam debitis architecto!
        </div>
        <SwapRouteDetail
          steps={ currentSteps }
          showStatus={ true }
        />
      </div>
    </div>
  );
};
export default SwapStepsModal;
