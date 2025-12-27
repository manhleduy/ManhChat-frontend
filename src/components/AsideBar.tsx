import {User, Settings,BookUser, MessageCircle, LogOut, NewspaperIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from './ui/label';
import { useAppDispatch } from '@/redux/reduxHook';
import { logout } from '@/redux/userSlice';

const AsideBar = () => {
  const dispatch= useAppDispatch();
  return (
    <div className='flex flex-col justify-between h-full w-[60px]  p-4 bg-green-400'>
      <div className='flex flex-col gap-5'>
        <a href="/profile" className='text-2xl font-bold'>
           <Tooltip>
            <TooltipTrigger asChild>
              <User width={30} height={30}/>
            </TooltipTrigger>
            <TooltipContent>
              <p>User</p>
            </TooltipContent>
          </Tooltip>
        </a>
        <a href="/" className='text-2xl font-bold'>
           <Tooltip>
            <TooltipTrigger asChild>
              <MessageCircle width={30} height={30}/>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chat</p>
            </TooltipContent>
          </Tooltip>
        </a>
        <a href="/contacts" className='text-2xl font-bold'>
           <Tooltip>
            <TooltipTrigger asChild>
              <BookUser width={30} height={30}/>
            </TooltipTrigger>
            <TooltipContent>
              <p>Contacts</p>
            </TooltipContent>
          </Tooltip>
        </a>
        <a href="/post" className='text-2xl font-bold'>
           <Tooltip>
            <TooltipTrigger asChild>
              <NewspaperIcon width={30} height={30}/>
            </TooltipTrigger>
            <TooltipContent>
              <p>News</p>
            </TooltipContent>
          </Tooltip>
        </a>
      </div>
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Settings height={30} width={30}/>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-100">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium flex items-center gap-2">Setting
              <Settings width={20} height={20}/>  
            </h4>              
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Chat Block Color</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Blue</SelectItem>
                  <SelectItem value="dark">Red</SelectItem>
                  <SelectItem value="system">Green</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Chat Background</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <button
            onClick={()=>{
              dispatch(logout())
            }}
            className='flex items-center gap-x-2 font-semibold'>
              <LogOut width={20} height={20} color='red'/>
              Logout
            </button>
            
          </div>
        </div>
      </PopoverContent>
    </Popover>

    </div>
  )
}

export default AsideBar