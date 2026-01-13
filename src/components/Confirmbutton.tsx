interface deleteProps{
  acceptFunc:any;
  cancelFunc:any;
  icon: React.ReactNode;
  setOpenConfirm:(check: boolean)=>void;
  openConfirm:boolean
}
const ConfirmButton= (props:deleteProps)=> {
    const {acceptFunc, cancelFunc, icon, setOpenConfirm, openConfirm}= props;
    if(!openConfirm){
        return (
        <button
            type='button'
            onClick={()=>setOpenConfirm(true)}
            className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-all"
        >
            {icon}
        </button>
        )
    }
    return (
        
      <div className={`fixed z-1000 inset-0 flex items-center justify-center bg-black bg-opacity-20  w-full h-full ${!openConfirm && "hidden"}`}>
        <div className="relative flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200">
            <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
                {icon}
            </div>
            <h2 className="text-gray-900 font-semibold mt-4 text-xl">Are you sure?</h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
                Do you really want to continue? This action<br />cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-4 mt-5 w-full">
                <button 
                type="button" 
                onClick={cancelFunc}
                className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition">
                    Cancel
                </button>
                <button 
                type="button" 
                onClick={acceptFunc}
                className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition">
                    Confirm
                </button>
            </div>
        </div>
      </div>
    );
};
export default ConfirmButton;