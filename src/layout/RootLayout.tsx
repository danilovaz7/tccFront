
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router";

export function RootLayout() {

    return (
        <div className=" overflow-x-hidden w-screen flex flex-col justify-start items-center h-screen gap-12">
            <Navbar
               
            />

            <Outlet />
        </div>
    );
}