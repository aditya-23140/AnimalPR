"use client"
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CirclesBackground from "@/components/background";
const slugPage = ({ pageExists,slug}) => {
  if (!pageExists) {
    return <><CirclesBackground height={window.innerHeight}/><div><Navbar/><main className="min-h-[79vh]">{slug}This is a incomplete page.</main><Footer/></div></>;
  }
}

export default slugPage;