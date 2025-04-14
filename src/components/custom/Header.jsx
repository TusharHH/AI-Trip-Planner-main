import { useState } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from '../ui/button';
import { FcGoogle } from "react-icons/fc";
import { FiLogOut, FiPlusCircle, FiCompass } from "react-icons/fi";
import Logo from '../../../public/download-removebg-preview.png';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json',
      },
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload();
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between max-w-screen-xl p-4 mx-auto">
        <a href="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="Adventure Logo"
            className="object-contain transition-transform w-14 hover:scale-105" 
          />
          <span className="hidden text-xl font-bold sm:block text-slate-800">Adventure</span>
        </a>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <a href="/create-trip">
                <Button variant="ghost" className="gap-2 text-sm rounded-full">
                  <FiPlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Trip</span>
                </Button>
              </a>
              <a href="/my-trips">
                <Button variant="ghost" className="gap-2 text-sm rounded-full">
                  <FiCompass className="w-4 h-4" />
                  <span className="hidden sm:inline">My Trips</span>
                </Button>
              </a>
              <Popover>
                <PopoverTrigger asChild>
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="object-cover transition-all rounded-full cursor-pointer w-9 h-9 hover:ring-2 hover:ring-slate-300"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ) : (
                    <div className="flex items-center justify-center text-sm font-bold text-white transition-all bg-blue-500 rounded-full cursor-pointer w-9 h-9 hover:ring-2 hover:ring-slate-300">
                      {user?.given_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2">
                  <button
                    onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="flex items-center w-full gap-2 p-2 text-sm rounded hover:bg-slate-100 text-slate-700"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <Button 
              onClick={() => setOpenDialog(true)} 
              className="rounded-full bg-slate-900 hover:bg-slate-800"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex flex-col items-center p-6">
              <img 
                src={Logo} 
                alt="App Logo" 
                className="w-20 h-20 mb-4"
              />
              <DialogTitle className="mb-2 text-2xl font-bold text-slate-800">
                Welcome Back
              </DialogTitle>
              <p className="mb-6 text-center text-slate-500">
                Sign in to access your personalized trips and adventures.
              </p>
              <Button
                onClick={login}
                variant="outline"
                className="w-full gap-3 px-6 py-5 text-base border-slate-200 hover:bg-slate-50"
              >
                <FcGoogle className="w-6 h-6" />
                Continue with Google
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default Header;